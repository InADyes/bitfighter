import * as buildDisplayReel from './buildDisplayReel';
import { buildFightReel } from '../shared/fight';
import { pickCharacter } from '../shared/characterPicker';
import { Status, Stats } from '../shared/statusTypes';
import * as fightReel from '../shared/fightReel';
import * as displayReel from '../shared/displayReel';

function pushToFrontEnd(obj: {characters: Status[], reel: displayReel.Event[]}) {
    let str = JSON.stringify(obj);
    localStorage.setItem('fight', str);
}

export class Game {
    timeout: NodeJS.Timer | null = null; // null if no timeout
    lastCombatants: Status[] = [];
    lastResults: Status[] = [];
    queue: Status[] = [];

    addCombatant(donation: {id: number, name: string, amount: number, character: number}) {
        this.queue.push(pickCharacter(donation))

        if (typeof(this.timeout) == 'number')
            this.nextFight();
    }
    nextFight() {
        let fight: fightReel.Event[];
        let display: displayReel.Event[];
        
        if (this.lastResults.length + this.queue.length < 2) {
            console.log('not enough combatants to fight');
            return ;
        }

        this.lastCombatants = this.lastResults.concat(this.queue.splice(0, this.lastResults.length));
        let result = buildFightReel(this.lastCombatants);
        this.lastResults = result.combatants;

        display = buildDisplayReel.build(result.reel);

        pushToFrontEnd({characters: this.lastCombatants, reel: display});

        this.timeout = setTimeout(
            () => {
                this.timeout = null;
                this.nextFight
            },
            display[display.length - 1].time + 3000
        );
    }
}
