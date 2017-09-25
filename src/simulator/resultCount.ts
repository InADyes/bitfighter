import { pickCharacter } from '../shared/characterPicker';
import { buildFightEvents } from '../shared/fight';
import * as FightEvents from '../shared/fightEvents';
import { stdout } from 'process';
import { buffs } from '../shared/buff';
import { Results, reelToResults, printResults } from './testPair';

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

    const results = chars.map(s => new Results(
        s.character,
        s.initialDonation
    ));

    const count = Number(process.argv[7]);

    for (let _ = 0; _ < count; _++) {
        while(true) {
            const { reel } = buildFightEvents(chars);
            reelToResults(results, reel);
            if (reel.find(e =>
                e.type === FightEvents.Types.death
                && e.character === 0
            ) !== undefined)
                break;
        }
    }
    printResults(results);
    console.log(`average kills, ${ results[1].losses / count }`)
}
