import * as buildDisplayReel from './buildDisplayReel';
import { buildFightReel } from '../shared/buildFightReel';
import { pickCharacter } from '../shared/characterPicker';
import { Status, Stats } from '../shared/statusTypes';
import * as fightReel from '../shared/fightReel';
import * as displayReel from '../shared/displayReel';
import * as frontEndMessage from '../shared/frontEndMessage';

function pushToFrontEnd(message: frontEndMessage.Message) {
    let str = JSON.stringify(message);
    localStorage.setItem('fight', str);
}

export class Game {
    timeout: NodeJS.Timer | null = null; // null if no timeout
    lastCombatants: Status[] = [];
    lastResults: Status[] = [];
    queue: Status[] = [];

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
        this.lastResults = result.combatants;

        display = buildDisplayReel.build(result.reel);

        pushToFrontEnd({characters: this.lastCombatants, reel: display});

        console.log('new fight: ', this);

        this.timeout = setTimeout(
            () => {
                this.timeout = null;
                this.nextFight();
            },
            display[display.length - 1].time + 5000
        );
    }
}
