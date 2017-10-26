import { fight } from '../shared/fight';
import { FightEvent } from '../shared/interfaces/fightEvents';
import { otherCharacter as other } from '../shared/utility';
import { Combatant } from '../shared/Combatant';

export class Results {
    hits = 0;
    miss = 0;
    total_damage = 0;
    crits = 0;
    wins = 0;
    losses = 0;
    totalTime = 0;

    constructor(
        public readonly classType: number,
        public readonly bits: number
    ) {}

    get average_damage() {
        return this.total_damage / (this.hits + this.miss);
    }

    get averageTime() {
        return this.totalTime / (this.wins + this.losses);
    }
}

export function testPair(
    chars: Combatant[],
    fights: number
) {
    let results = chars.map(s => new Results(
        s.character,
        s.initialDonation
    ));

    for (let i = 0; i < fights; i++) {
        const reel = fight(chars).reel.map(e => e.fight);

        reelToResults(results, reel, chars);
    }
    return results;
}

export function reelToResults(
    results: Results[],
    reel: FightEvent[],
    combatants: Combatant[]
) {
    results[0].totalTime += reel[reel.length - 1].time - reel[0].time;

    for (const event of reel) {
        const targetIndex = combatants.findIndex(s => s.id === event.targetID);
        if (targetIndex === -1) {
            console.error('invalid target ID: ', event.targetID);
            continue;
        }

        switch (event.type) {
            case 'damage':
                results[other(targetIndex)].total_damage += event.amount;
                results[other(targetIndex)].hits++;
                break;
            case 'dodge':
                results[other(targetIndex)].miss++;
                break;
            case 'heal':
                break;
            case 'death':
                results[targetIndex].losses++;
                results[other(targetIndex)].wins++;
                break;
            case 'crit':
                results[other(targetIndex)].crits++;
                break;
            default:
                break;
        }
    }
    return results;
}

export function printResults(results: Results[]) {
    
    console.log('averageTime, ', (results[0].averageTime / 1000).toFixed(2));
    console.log(`classType, ${ results[0].classType }, ${ results[1].classType }`);
    console.log(`hits, ${ results[0].hits }, ${ results[1].hits }`);
    console.log(`miss, ${ results[0].miss }, ${ results[1].miss }`);
    console.log(`total_damage, ${ results[0].total_damage }, ${ results[1].total_damage }`);
    console.log(`crits, ${ results[0].crits }, ${ results[1].crits }`);
    console.log(`wins, ${ results[0].wins }, ${ results[1].wins }`);
    console.log(`losses, ${ results[0].losses }, ${ results[1].losses }`);
    console.log(`average_damage, ${ results[0].average_damage }, ${ results[1].average_damage }`);
}
