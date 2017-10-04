import { buildEvents } from '../shared/buildEvents';
import * as FightEvents from '../shared/fightEvents';
import { otherCharacter as other } from '../shared/utility';
import { Status } from '../shared/Status';

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
    chars: Status[],
    fights: number
) {
    let results = chars.map(s => new Results(
        s.character,
        s.initialDonation
    ));

    for (let i = 0; i < fights; i++) {
        const reel = buildEvents(chars).reel.map(e => e.fight);

        reelToResults(results, reel);
    }
    return results;
}

export function reelToResults(
    results: Results[],
    reel: FightEvents.Event[]
) {
    results[0].totalTime += reel[reel.length - 1].time - reel[0].time;

    for (const event of reel) {
        switch (event.type) {
            case FightEvents.Types.damage:
                results[other(event.character)].total_damage += (<FightEvents.Damage>event).amount;
                results[other(event.character)].hits++;
                break;
            case FightEvents.Types.dodge:
                results[other(event.character)].miss++;
                break;
            case FightEvents.Types.healing:
                break;
            case FightEvents.Types.death:
                results[event.character].losses++;
                results[other(event.character)].wins++;
                break;
            case FightEvents.Types.crit:
                results[other(event.character)].crits++;
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
