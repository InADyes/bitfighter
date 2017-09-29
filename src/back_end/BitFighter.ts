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

export class BitFighter {
    private fightStartTime: number = 0;
    private timeout: number | null = null; // null if no timeout
    private lastCombatants: Status[] = [];
    private lastResults: Status[] = [];
    private lastEvents: FightEvents.Event[] = [];
    private queue: Status[] = [];

    private characterChoiceHandler = new CharacterChoiceHandler(
        status => {
            this.newCombatant(status);
        },
        (characterChoices, id) => {
            this.sendMessageToFont({characterChoices, id});
        }
    );

    constructor(
        private sendMessageToFont: (message: frontEndMessage.BackToFrontMessage) => void,
        public settings: Settings = {
            delayBetweenFights: 5000,
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
            combatantIndex = this.lastCombatants.findIndex(s => s.id === id);
            if (combatantIndex !== -1) {
                const patchTime = performance.now() - this.fightStartTime;

                this.insertEvents(
                    [
                        new FightEvents.Donation(
                            patchTime,
                            combatantIndex,
                            FightEvents.DonationType.healing
                        ),
                        new FightEvents.Healing(
                            patchTime,
                            combatantIndex,
                            amount * this.settings.donationToHPRatio
                        ),
                    ],
                    patchTime
                );
                return;
            }
        }
        combatantIndex = this.lastResults.findIndex(s => s.id === id);
        if (combatantIndex !== -1) {
            const patchTime = performance.now() - this.fightStartTime;

            this.insertEvents(
                [
                    new FightEvents.Donation(
                        combatantIndex,
                        patchTime,
                        FightEvents.DonationType.healing
                    ),
                    new FightEvents.Healing(
                        patchTime,
                        combatantIndex,
                        amount * this.settings.donationToHPRatio
                    ),
                ],
                patchTime
            );
            return;
        }

        // if the donation is enough for a character and they aren't already in the queue
        if (this.queue.some(s => {return s.id === id;}) === false
            && amount >= this.settings.minimumDonation) {
            this.characterChoiceHandler.requestChoice({id, name, amount, profileImageURL, chatMessage});
            return;
        }


        // if there was a last fight, damage current champion
        if (this.lastCombatants.length > 0) {
            const patchTime = performance.now() - this.fightStartTime;

            this.insertEvents(
                [
                    new FightEvents.Donation(
                        patchTime,
                        0,
                        FightEvents.DonationType.damage
                    ),
                    new FightEvents.Damage(
                        patchTime,
                        0,
                        amount * this.settings.donationToHPRatio
                    ),
                ],
                patchTime
            );
        }
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
    private insertEvents(insert: FightEvents.Event[], patchTime: number) {
        // set baseline to current timestamp
        applyFightEvents(
            this.lastCombatants,
            ...this.lastEvents.filter(e => {
                return e.time < patchTime;
            })
        );
        
        // create a temporary copy of status
        let tempStatus = this.lastCombatants.map(s => new Status(
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
        results.reel.forEach(e => e.time += + 2000);

        // add the rest of the events to the old events
        insert = insert.concat(results.reel);
        this.lastEvents = insert;

        this.pushLastResults(patchTime);
    }

    private nextFight() {
        let fight: FightEvents.Event[];
        let display: graphicsEvents.Event[];
        
        if (this.timeout != null) {
            console.log('cannot start fight: fight already in progress');
            return ;
        }

        this.lastCombatants = this.lastResults.concat(this.queue.splice(0, 2 - this.lastResults.length));
        let result = buildFightEvents(this.lastCombatants);
        result.reel.forEach(e => e.time *= this.settings.gameSpeedMultipier);
        this.lastResults = result.combatants;
        this.fightStartTime = performance.now();
        this.lastEvents = result.reel;

        this.pushLastResults();
    }

    private pushLastResults(patchTime?: number) {
        
        let graphicsEvents = buildGraphicsEvents.build(this.lastEvents);

        this.sendMessageToFont({
            newReel: {
                    characters: this.lastCombatants.map(c => ({
                        name: c.name,
                        maxHitPoints: c.baseStats.maxHitPoints,
                        currentHitPoints: c.hitPoints,
                        art: c.character,
                        profileImageURL: c.profileImageURL,
                        chatMessage: c.chatMessage
                    })
                ),
                reel: graphicsEvents,
                patch: patchTime
            }
        });
        console.log('new fight');

        if (this.lastCombatants.length > 1) {
            if (this.timeout !== null) 
                window.clearTimeout(this.timeout);

            this.timeout = window.setTimeout(
                () => {
                    console.log('fight over');
                    this.timeout = null;
                    this.checkQueue();
                },
                graphicsEvents[0] ? graphicsEvents[graphicsEvents.length - 1].time : + this.settings.delayBetweenFights
            );
        }
    }
}
