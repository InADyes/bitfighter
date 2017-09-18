import * as buildDisplayReel from './buildDisplayReel';
import { buildFightReel } from '../shared/buildFightReel';
import { pickCharacter } from '../shared/characterPicker';
import { Stats } from '../shared/Status';
import * as fightReel from '../shared/fightReel';
import * as displayReel from '../shared/displayReel';
import * as frontEndMessage from '../shared/frontEndMessage';
import { Settings } from './backendSettings'

import { Status } from '../shared/help';

export class Game {
    private timeout: NodeJS.Timer | null = null; // null if no timeout
    private lastCombatants: Status[] = [];
    private lastResults: Status[] = [];
    private queue: Status[] = [];
    public settings: Settings = {
        delayBetweenFights: 3000,
        gameSpeedMultipier: 1
    };

    constructor(
        private sendFightMessage: (message: frontEndMessage.Message) => void,
        settings?: Settings
    ) {
        if (settings)
            this.settings = settings;
    }

    addCombatant(donation: {id: number, name: string, amount: number, character: number}) {
        this.queue.push(pickCharacter(donation))
        console.log('new combatant added to queue');

        this.nextFight();
    }
    nextFight() {
        let fight: fightReel.Event[];
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

        display = buildDisplayReel.build(result.reel);

        let frontCharacterInfo: {
            name: string,
            hitPoints: number
        }[] = [];

        for (let c of this.lastCombatants) {
            frontCharacterInfo.push({
                   name: c.name,
                   hitPoints: c.hitPoints
            });
        }

        this.sendFightMessage({characters: frontCharacterInfo, reel: display});

        console.log('new fight: ', this);

        this.timeout = setTimeout(
            () => {
                this.timeout = null;
                this.nextFight();
            },
            display[display.length - 1].time + this.settings.delayBetweenFights
        );
    }
}
