import * as buildGraphicsEvents from './buildGraphicsEvents';
import { buildFightEvents } from '../shared/fight';
import { Character, pickCharacter } from '../shared/characterPicker';
import { Stats, Status } from '../shared/Status';
import * as FightEvents from '../shared/fightEvents';
import * as graphicsEvents from '../shared/graphicsEvents';
import * as frontEndMessage from '../shared/frontEndMessage';
import { Settings } from './backendSettings'
import { applyFightEvents } from '../shared/applyFightEvents'

import { CharacterChoiceHandler } from './characterChoiceHandler';

export class Game {
    private fightStartTime: number = 0;
    private timeout: NodeJS.Timer | null = null; // null if no timeout
    private lastCombatants: Status[] = [];
    private lastResults: Status[] = [];
    private lastEvents: FightEvents.Event[] = [];
    private queue: Status[] = [];
    public settings: Settings = {
        delayBetweenFights: 3000,
        gameSpeedMultipier: 1,
        minimumDonation: 1000,
        donationToHPRatio: 1
    };

    // private characterChoiceHandler = new CharacterChoiceHandler(
    //     () = {

    //     }
    // );

    constructor(
        private sendFightMessage: (message: frontEndMessage.Message) => void,
        private requestCharacterChoice: (fanID: number, character: Character[]) => number,
        settings?: Settings
    ) {
        if (settings)
            this.settings = settings;
    }

    public donation(donation: {id: number, name: string, amount: number, character: number}) {

        // if the fight is ongoing
        if (this.timeout !== null) {
            // and the donation matches a fighter
            const combatantIndex = this.lastCombatants.findIndex(s => {
                return s.id === donation.id;
            });
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
                            donation.amount * this.settings.donationToHPRatio
                        ),
                    ],
                    patchTime
                );
                return;
            }
        }

        // if the donation is enough for a character and they aren't already in the queue
        if (this.queue.some(s => {return s.id === donation.id;}) === false
            && donation.amount >= this.settings.minimumDonation) {
            // if (donation.character == -1) {
            //     donation.character = cardPick(donation, this.requestCharacterChoice); // todo
            // }
            console.log(donation.character);
            this.queue.push(pickCharacter(donation))
            this.nextFight();
            return;
        }


        // if there was a last fight, damage current champion
        if (this.lastCombatants.length > 1) {
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
                        donation.amount * this.settings.donationToHPRatio
                    ),
                ],
                patchTime
            );
        }
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
        let tempStatus = this.lastCombatants.map( s => {
            return new Status(
                s.id,
                s.name,
                s.character,
                s.initialDonation,
                s.hitPoints,
                s.level,
                s.baseStats
            );
        });

        // apply new events
        applyFightEvents(tempStatus, ...insert);

        // caculate the rest of the events
        let results = buildFightEvents(tempStatus);
        results.reel.forEach(e => e.time += + 2000);

        // add the rest of the events to the old events
        insert.concat(results.reel);
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

        if (this.lastResults.length + this.queue.length < 2) {
            console.log('cannot start fight: not enough combatants');
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

        this.sendFightMessage({
            characters: this.lastCombatants.map(c => {return {
                    name: c.name,
                    maxHitPoints: c.baseStats.maxHitPoints,
                    currentHitPoints: c.hitPoints,
                    art: c.character
                }
            }),
            reel: graphicsEvents,
            patch: patchTime
        });
        
        console.log('new fight: ', this);

        if (this.timeout !== null) 
            clearTimeout(this.timeout);

        this.timeout = setTimeout(
            () => {
                console.log('fight over');
                this.timeout = null;
                this.nextFight();
            },
            graphicsEvents[graphicsEvents.length - 1].time + this.settings.delayBetweenFights
        );
    }
}
