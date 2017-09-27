import { pickCharacter } from '../shared/characterPicker';
import { buildFightEvents } from '../shared/fight';
import * as FightEvents from '../shared/fightEvents';
import { stdout } from 'process';
import { buffs } from '../shared/buff';
import { Results, reelToResults, printResults } from './testPair';
import { Status } from '../shared/Status';

export function countPairStats(
    chars: Status[],
    count: number
) {
    const results = chars.map(s => new Results(
        s.character,
        s.initialDonation
    ));
    
    for (let _ = 0; _ < count; _++) {
        for (let __ = 0; __ < 1000; __++){
            const { reel } = buildFightEvents(chars);
            reelToResults(results, reel);
            if (reel.find(e =>
                e.type === FightEvents.Types.death
                && e.character === 0
            ) !== undefined)
                break;
        }
    }

    return results;
}

export function resultCount() {
    const chars = [
        pickCharacter({
            id: 0,
            name: 'shawn',
            amount: Number(process.argv[3]),
            character: Number(process.argv[2])
        }),
        pickCharacter({
            id: 1,
            name: 'hao',
            amount: Number(process.argv[5]),
            character: Number(process.argv[4])
        })
    ];

    const count = Number(process.argv[7])

    let results = countPairStats(chars, count);

    printResults(results);
    console.log(`average kills, ${ results[1].losses / results[0].losses }`)
}