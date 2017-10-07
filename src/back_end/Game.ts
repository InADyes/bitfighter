import { sortGraphicsEvents } from '../shared/buildGraphicsEvents';
import { buildEvents } from '../shared/buildEvents';
import { Stats, Status, cardStats } from '../shared/Status';
import { Character, pickCharacter, characters } from '../shared/characterPicker';
import * as FightEvents from '../shared/fightEvents';
import * as graphicsEvents from '../shared/graphicsEvents';
import { BackToFrontMessage } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { BackendSettings as Settings } from './settings'
import { applyFightEvents, CombinedEvent } from '../shared/applyFightEvents'
import { CharacterChoiceHandler } from './characterChoiceHandler';
import { hrtime } from 'process';
import { Donation } from '../shared/interfaces/donation';

function nodePerformanceNow() {
    if (hrtime) {
        const time = hrtime();
        return time[0] * 1e3 + time[1] / 1e6;
    }
    return performance.now();
};

export class Game {
    private fightStartTime: number = 0;
    private timeout: NodeJS.Timer | null = null;
    private combatants: Status[] = [];
    private events: CombinedEvent[] = [];
    private lastDamageDonation: Donation | null = null;

    constructor(
        private readonly settings: Settings,
        private readonly sendMessageToFront: (message: BackToFrontMessage, fan?: number) => void,
        private readonly fightOver: () => void
    ) {

    }

    public addCombatant(...combatant: Status[]) {
        if (this.combatants.length >= 2) {
            console.log('cannot start fight: fight already ongoing');
            this.sendMessageToFront({
                queue: { queue: combatant.map(s => ({
                    fanDisplayName: s.name, 
                    championTypeName: characters[s.character].name
                })) }
            });
            return;
        }

        if (this.timeout !== null)
            clearTimeout(this.timeout);

        this.combatants = this.combatants.concat(combatant.splice(0, 2 - this.combatants.length));

        const result = buildEvents(this.combatants);
        this.fightStartTime = nodePerformanceNow();
        this.events = result.reel;

        this.pushLastResults();
        this.timeoutNextEvent();
    }

    public searchFightForCombatant(id: number) {
        return this.combatants.findIndex(s => s.id === id);
    }
    
    public healCombatant(index: number, donation: Donation) {
        const patchTime = nodePerformanceNow() - this.fightStartTime;
        const combatant = this.combatants[index];

        let amount = this.settings.donationToHPRatio * donation.amount;
        if (combatant.hitPoints + donation.amount > combatant.stats.maxHitPoints)
            amount = combatant.stats.maxHitPoints - combatant.hitPoints;

        this.insertEvents(
            patchTime,
            donation,
            new FightEvents.HealingDonation(
                patchTime,
                index,
                donation,
                amount
            )
        );
    }

    public damageCombatant(index: number, donation: Donation) {
        if (this.combatants[index] === undefined) {
            console.log(`combatant with index ${ index } does not exist`);
            return;
        }

        const patchTime = nodePerformanceNow() - this.fightStartTime;
        
        const combatant = this.combatants[index];
        let amount = this.settings.donationToHPRatio * donation.amount;

        if (combatant.hitPoints < amount)
            amount = combatant.hitPoints;

        this.insertEvents(
            patchTime,
            donation,
            new FightEvents.DamageDonation(
                patchTime,
                0,
                donation,
                amount
            )
        );
    }
    
    // push the current events to everyone
    public pushLastResults(patchTime?: number, fan?: number) {
        const graphics: graphicsEvents.Event[] = [];
        this.events.forEach(e => graphics.push(...e.graphics));
        sortGraphicsEvents(graphics);

        this.sendMessageToFront(
            {
                newReel: {
                        characters: this.combatants.map(c => ({
                            name: c.name,
                            maxHitPoints: Math.ceil(c.baseStats.maxHitPoints),
                            currentHitPoints: Math.ceil(c.hitPoints),
                            art: c.character,
                            profileImageURL: c.profileImageURL,
                            bossMessage: c.bossMessage,
                            card: c.card,
                            bossEmoticonURL: c.bossEmoticonURL
                        })
                    ),
                    reel: graphics,
                    patch: patchTime
                },
                // queue: { queue: this.queue.map(s => ({
                //     fanDisplayName: s.name, 
                //     championTypeName: characters[s.character].name
                // }))},
                characterList: fan ? cardStats : undefined
            },
            fan
        );
    }
    
    // only works when all new events have the same time
    public insertEvents(patchTime: number, donation: Donation, ...insert: FightEvents.Event[]) {

        // create a temporary copy of status
        const tempStatus = this.combatants.map(s => s.clone());

        // apply new events
        const reel = applyFightEvents(tempStatus, ...insert);

        // set the current events to the calculated events
        reel.push(...buildEvents(tempStatus, patchTime).reel);
        this.events = reel;

        this.pushLastResults(patchTime);
        
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeoutNextEvent();
    }
    
    private timeoutNextEvent() {
        // if there is more left in the 
        if (this.events.length > 0) { 
            const timeout = this.events[0].fight.time - (nodePerformanceNow() - this.fightStartTime);

            this.timeout = setTimeout(
                () => {
                    this.timeout = null;
                    this.nextEvent();
                },
                timeout > 0 ? timeout : 0
            );
        } else {
            this.timeout = setTimeout(
                () => {
                    this.timeout = null;
                    this.fightOver();
                },
                this.settings.delayBetweenFights
            );
        }
    }

    //plays next fight event and queues the one after
    private nextEvent() {
        const event = this.events.shift();

        if (event === undefined) {
            console.error('no events left in fight');
            return;
        }
        applyFightEvents(this.combatants, event.fight);
    
        if (event.fight.type === FightEvents.Types.damageDonation)
            this.lastDamageDonation = (<FightEvents.DamageDonation>event.fight).donation;

        // if the boss was killed by a damage donation they become the new boss
        if (event.fight.type === FightEvents.Types.death
            && this.combatants.length === 0
            && this.lastDamageDonation) {
            this.combatants.push(pickCharacter(
                this.lastDamageDonation,
                Math.floor(Math.random() * characters.length)
            ));
            this.pushLastResults();
        }

        this.timeoutNextEvent();
    }

    public isBusy(): boolean {
        return this.timeout !== null;
    }

    public getCombatants() {
        return this.combatants;
    }
}