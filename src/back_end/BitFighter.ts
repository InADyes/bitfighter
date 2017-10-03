import { Packet } from '_debugger';
import * as buildGraphicsEvents from './buildGraphicsEvents';
import { buildFightEvents } from '../shared/fight';
import { Stats, Status } from '../shared/Status';
import { Character, pickCharacter } from '../shared/characterPicker';
import * as FightEvents from '../shared/fightEvents';
import * as graphicsEvents from '../shared/graphicsEvents';
import * as frontEndMessage from '../shared/frontEndMessage';
import { Settings } from './backendSettings'
import { applyFightEvents } from '../shared/applyFightEvents'
import { CharacterChoiceHandler } from './characterChoiceHandler';
import { hrtime } from 'process';

function nodePerformanceNow() {
    if (hrtime) {
        const time = hrtime();
        return time[0] * 1e3 + time[1] / 1e6;
    }
    return performance.now();
};

export class BitFighter {
    private fightStartTime: number = 0;
    private timeout: NodeJS.Timer | null = null;
    private combatants: Status[] = [];
    private events: FightEvents.Event[] = [];
    private queue: Status[] = [];

    private characterChoiceHandler = new CharacterChoiceHandler(
        status => {
            this.newCombatant(status);
        },
        (characterChoices, id) => {
            this.sendMessageToFont({characterChoices}, id);
        }
    );

    constructor(
        private sendMessageToFont: (message: frontEndMessage.BackToFrontMessage, fan?: number) => void,
        public settings: Settings = {
            delayBetweenFights: 3000,
            gameSpeedMultipier: 1,
            minimumDonation: 200,
            donationToHPRatio: 1
        }
    ) {}

    public receivedFanGameState(id: number, choice: frontEndMessage.FrontToBackMessage) {
        this.characterChoiceHandler.completeChoice(id, choice.characterChoice.choice, true);
    }
    public donation(id: number, name: string, amount: number, profileImageURL: string, chatMessage: string) {

        let combatantIndex: number;
        // if the fight is ongoing
        if (this.timeout !== null) {
            // and the donation matches a fighter
            combatantIndex = this.combatants.findIndex(s => s.id === id);
            if (combatantIndex !== -1) {
                this.healCombatant(combatantIndex, this.settings.donationToHPRatio * amount);
                return;
            }
        }
        combatantIndex = this.combatants.findIndex(s => s.id === id);
        if (combatantIndex !== -1) {
            this.healCombatant(combatantIndex, this.settings.donationToHPRatio);
            return;
        }

        // if the donation is enough for a character and they aren't already in the queue
        if (this.queue.some(s => {return s.id === id;}) === false
            && amount >= this.settings.minimumDonation) {
            this.characterChoiceHandler.requestChoice({id, name, amount, profileImageURL, chatMessage});
            return;
        }


        // if there was a last fight, damage current champion
        if (this.combatants.length > 0) {
            const patchTime = nodePerformanceNow() - this.fightStartTime;
            this.damageCombatant(0, amount * this.settings.donationToHPRatio);
        }
    }

    private healCombatant(index: number, amount: number) {
        const patchTime = nodePerformanceNow() - this.fightStartTime;
        const combatant = this.combatants[index];

        if (combatant.hitPoints + amount > combatant.stats.maxHitPoints)
            amount = combatant.stats.maxHitPoints - combatant.hitPoints;

        this.insertEvents(
            patchTime,
            new FightEvents.Donation(
                patchTime,
                index,
                FightEvents.DonationType.healing
            ),
            new FightEvents.Healing(
                patchTime,
                index,
                amount
            )
        );
    }

    private damageCombatant(index: number, amount: number) {
        const patchTime = nodePerformanceNow() - this.fightStartTime;
        
        const combatant = this.combatants[index];
        if (combatant.hitPoints < amount)
            amount = combatant.hitPoints;

        this.insertEvents(
            patchTime,
            new FightEvents.Donation(
                patchTime,
                0,
                FightEvents.DonationType.damage
            ),
            new FightEvents.Damage(
                patchTime,
                0,
                amount
            )
        );
    }

    public checkQueue() {
        if (this.queue.length > 0)
            this.nextFight();
    }
    
    // public for testing purposes (bypasses front end character choice)
    public newCombatant(status: Status) {
        this.queue.push(status)
        this.nextFight();
    }

    // only works when all new events have the same time
    private insertEvents(patchTime: number, ...insert: FightEvents.Event[]) {

        // create a temporary copy of status
        let tempStatus = this.combatants.map(s => new Status(
            s.id,
            s.name,
            s.character,
            s.initialDonation,
            s.hitPoints,
            s.level,
            s.baseStats,
            s.profileImageURL,
            s.chatMessage
        ));

        // apply new events
        applyFightEvents(tempStatus, ...insert);

        // caculate the rest of the events
        let results = buildFightEvents(tempStatus);
        results.reel.forEach(e => e.time += patchTime + 1000);

        // add the rest of the events to the old events
        insert = insert.concat(results.reel);
        this.events = insert;

        this.pushLastResults(patchTime);
        
        if (this.timeout)
            clearTimeout(this.timeout);
        if (this.events.length > 0) {
            this.timeout = setTimeout(
                () => this.nextEvent(),
                0
            );
        }
    }

    // start a new fight
    private nextFight() {
        if (this.combatants.length >= 2) {
            console.log('cannot start fight: fight already ongoing');
            return;
        }

        if (this.timeout !== null)
            clearTimeout(this.timeout);

        this.combatants = this.combatants.concat(this.queue.splice(0, 2 - this.combatants.length));

        const result = buildFightEvents(this.combatants);
        result.reel.forEach(e => e.time *= this.settings.gameSpeedMultipier);
        this.fightStartTime = nodePerformanceNow();
        this.events = result.reel;

        this.pushLastResults();

        if (this.events.length > 0) {
            this.timeout = setTimeout(
                () => this.nextEvent(),
                this.events[0].time
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
        applyFightEvents(this.combatants, event);

        // if there is more left in the 
        if (this.events.length > 0) {
            this.timeout = setTimeout(
                () => this.nextEvent(),
                this.events[0].time - event.time
            );
        } else {
            this.timeout = setTimeout(
                () => this.checkQueue(),
                this.settings.delayBetweenFights
            );
        }
    }

    // push the current events to everyone
    private pushLastResults(patchTime?: number) {
        this.sendMessageToFont({
            newReel: {
                    characters: this.combatants.map(c => ({
                        name: c.name,
                        maxHitPoints: c.baseStats.maxHitPoints,
                        currentHitPoints: c.hitPoints,
                        art: c.character,
                        profileImageURL: c.profileImageURL,
                        chatMessage: c.chatMessage
                    })
                ),
                reel: buildGraphicsEvents.build(this.events),
                patch: patchTime
            }
        });
    }
}
