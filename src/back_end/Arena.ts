import { Packet } from '_debugger';
import { generateBitBoss } from './generateBitBoss';
import { sortGraphicsEvents } from '../shared/buildGraphicsEvents';
import { buildEvents } from '../shared/buildEvents';
import { Status, cardStats } from '../shared/Status';
import { pickCharacter, characters, characterTypes } from '../shared/characterPicker';
import * as FightEvents from '../shared/fightEvents';
import { Event as GraphicsEvent} from '../shared/graphicsEvents';
import { BackToFrontMessage, ReelMessage } from '../shared/interfaces/backToFrontMessage';
import { BackendSettings as Settings } from './interfaces';
import { applyFightEvents, CombinedEvent } from '../shared/applyFightEvents'
import { CharacterChoiceHandler } from './CharacterChoiceHandler';
import { hrtime } from 'process';
import { Donation } from '../shared/interfaces/donation';

function nodePerformanceNow() {
    if (hrtime) {
        const time = hrtime();
        return time[0] * 1e3 + time[1] / 1e6;
    }
    return performance.now();
};

export class Arena {
    private fightStartTime: number = 0;
    private timeout: NodeJS.Timer | null = null;
    private readonly combatants: Status[] = [];
    public results: Status[] = [];
    private events: CombinedEvent[] = [];
    private lastDamageDonation: Donation | null = null;

    constructor(
        public settings: Settings,
        private readonly newFightResults: (message: ReelMessage, timer?: number) => void,
        private readonly fightOver: () => void
    ) {}

    public clearTimeouts() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    public bossKill() {
        if (this.combatants.length < 1)
            return;
        this.combatants.splice(0, 1);
        this.startFight(0);
    }

    public addCombatants(countdown: number, ...combatants: Status[]) {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        this.combatants.push(...combatants);
        this.startFight(countdown);
    }

    private startFight(countdown: number, ...baseReel: FightEvents.Event[]) {
        const tempStatus = this.combatants.map(s => s.clone());
        const combinedBase = applyFightEvents(tempStatus, ...baseReel)

        const result = buildEvents(tempStatus, countdown);
        this.results = result.combatants;
        this.fightStartTime = nodePerformanceNow();
        this.events = combinedBase.concat(result.reel);

        this.pushLastResults({countdown: countdown === 0 ? undefined : countdown});
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeoutNextEvent();
    }

    public searchForCombatant(id: number) {
        return this.combatants.findIndex(s => s.id === id);
    }
    
    public healCombatant(index: number, donation: Donation) {
        const patchTime = nodePerformanceNow() - this.fightStartTime;
        const combatant = this.combatants[index];

        const amount = this.settings.donationToHPRatio * donation.amount;

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
        const amount = this.settings.donationToHPRatio * donation.amount;

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

    public lastResults(patchTime?: number): ReelMessage {
        const graphics: GraphicsEvent[] = [];
        this.events.forEach(e => graphics.push(...e.graphics));
        sortGraphicsEvents(graphics);

        return {
            characters: this.combatants.map(c => ({
                name: c.name,
                maxHitPoints: Math.ceil(c.baseStats.maxHitPoints),
                currentHitPoints: Math.ceil(c.hitPoints),
                art: c.character,
                profileImageURL: c.profileImageURL,
                bossMessage: c.bossMessage,
                card: c.card,
                bossEmoticonURL: c.bossEmoticonURL,
                className: c.className
            })
        ),
        reel: graphics,
        patch: patchTime
        }
    }
    
    // push the current events to everyone
    public pushLastResults(options?: {countdown?: number, patchTime?: number}) {
        this.newFightResults(
            this.lastResults(
                options ? options.patchTime : undefined
            ),
            options ? options.countdown : undefined
        );
    }
    
    // only works when all new events have the same time
    public insertEvents(patchTime: number, donation: Donation, ...insert: FightEvents.Event[]) {

        // create a temporary copy of status
        const tempStatus = this.combatants.map(s => s.clone());

        // apply new events
        const reel = applyFightEvents(tempStatus, ...insert);
        
        // calculate the results of the new events
        reel.push(...buildEvents(tempStatus, patchTime).reel);

        // if the new events caused the chapion to die instead start a fight
        if (
            this.settings.bitFighterEnabled
            && this.combatants.length === 1
            && reel.some(e => e.fight.type === FightEvents.Types.death)
        ) {
            this.combatants.push(pickCharacter(donation, characterTypes.graveDigger, this.settings.characterNames));
            this.startFight(0, new FightEvents.Healing(0, 0, this.combatants[0].stats.maxHitPoints * 0.1));
            return;
        }
        this.events = reel;

        this.pushLastResults({patchTime});
        
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

        // if the boss was killed by a damage donation they become the bitBoss
        if (event.fight.type === FightEvents.Types.death
            && this.combatants.length === 0
            && this.lastDamageDonation) {
            this.combatants.push(generateBitBoss(
                this.lastDamageDonation,
                this.settings.bitBossStartingHealth + (<FightEvents.Death>event.fight).overkill
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
