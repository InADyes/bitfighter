import * as buildDisplayReel from './buildDisplayReel';
import { buildFightReel } from '../shared/buildFightReel';
import { pickCharacter } from '../shared/characterPicker';
import { Stats } from '../shared/Status';
import * as FightReel from '../shared/fightReel';
import * as displayReel from '../shared/displayReel';
import * as frontEndMessage from '../shared/frontEndMessage';
import { Settings } from './backendSettings'
import { applyFightReel } from './applyFightReel'

import { Status } from '../shared/Status';

export class Game {
    private fightStartTime: number = 0;
    private timeout: NodeJS.Timer | null = null; // null if no timeout
    private lastCombatants: Status[] = [];
    private lastResults: Status[] = [];
    private lastReel: FightReel.Event[] = [];
    private queue: Status[] = [];
    public settings: Settings = {
        delayBetweenFights: 3000,
        gameSpeedMultipier: 1,
        minimumDonation: 1000,
        donationToHPRatio: 1
    };

    constructor(
        private sendFightMessage: (message: frontEndMessage.Message) => void,
        settings?: Settings
    ) {
        if (settings)
            this.settings = settings;
    }

    private addCombatant(donation: {id: number, name: string, amount: number, character: number}) {
        this.queue.push(pickCharacter(donation))
        console.log('new combatant added to queue');

        this.nextFight();
    }

    public donation(donation: {id: number, name: string, amount: number, character: number}) {

        // if the fight is ongoing
        if (this.timeout !== null) {
            // and the donation matches a fighter
            const combatantIndex = this.lastCombatants.findIndex(s => {
                return s.id === donation.id;
            });
            if (combatantIndex !== undefined) {
                const patchTime = performance.now() - this.fightStartTime;

                this.insertEvents(
                    [
                        new FightReel.DonationEvent(
                            patchTime,
                            combatantIndex,
                            FightReel.DonationType.healing
                        ),
                        new FightReel.HealingEvent(
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

        if (this.queue.some(s => {return s.id === donation.id;}) === false
            && donation.amount >= this.settings.minimumDonation) {
            this.addCombatant(donation);
            return;
        }


        //if there was a last fight, damage current champion
        if (this.lastCombatants.length > 1) {
            const patchTime = performance.now() - this.fightStartTime;

            this.insertEvents(
                [
                    new FightReel.DonationEvent(
                        patchTime,
                        0,
                        FightReel.DonationType.damage
                    ),
                    new FightReel.DamageEvent(
                        patchTime,
                        0,
                        donation.amount * this.settings.donationToHPRatio
                    ),
                ],
                patchTime
            );
        }
    }

    //only works when all new events have the same time
    private insertEvents(insert: FightReel.Event[], patchTime: number) {
        // set baseline to current timestamp
        applyFightReel(
            this.lastCombatants,
            this.lastReel.filter(e => {
                return e.time < patchTime;
            })
        );
        
        //create a temporary copy of status
        let tempStatus = this.lastCombatants.map( s => {
            return new Status(
                s.id,
                s.name,
                s.character,
                s.donation,
                s.hitPoints,
                s.level,
                s.baseStats
            );
        });

        //apply new events
        applyFightReel(tempStatus, insert);

        // caculate the rest of the events
        let results = buildFightReel(tempStatus);
        results.reel.forEach(e => e.time += + 2000);

        // add the rest of the events to the old events
        insert.concat(results.reel);
        this.lastReel = insert;

        this.pushLastResults(patchTime);
    }

    private nextFight() {
        let fight: FightReel.Event[];
        let display: displayReel.Event[];
        
        if (this.timeout != null) {
            console.log('cannot start fight: fight already in progress');
            return ;
        }

        if (this.lastResults.length + this.queue.length < 2) {
            console.log('cannot start fight: not enough combatants');
            return ;
        }

        this.lastCombatants = this.lastResults.concat(this.queue.splice(0, 2 - this.lastResults.length));
        let result = buildFightReel(this.lastCombatants);
        result.reel.forEach(e => e.time *= this.settings.gameSpeedMultipier);
        this.lastResults = result.combatants;
        this.fightStartTime = performance.now();
        this.lastReel = result.reel;

        this.pushLastResults();
    }

    private pushLastResults(patchTime?: number) {
        
        let displayReel = buildDisplayReel.build(this.lastReel);

        this.sendFightMessage({
            characters: this.lastCombatants.map(c => {
                return {
                    name: c.name,
                    hitPoints: c.hitPoints,
                    art: c.character
                }
            }),
            reel: displayReel,
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
            displayReel[displayReel.length - 1].time + this.settings.delayBetweenFights
        );
    }
}
