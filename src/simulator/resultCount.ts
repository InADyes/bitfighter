import { pickCharacter } from '../shared/characterPicker';
import { fight } from '../shared/fight';
import { stdout } from 'process';
import { buffs } from '../shared/interfaces/buff';
import { Results, reelToResults, printResults } from './testPair';
import { Combatant } from '../shared/Combatant';

export function countPairStats(
    chars: Combatant[],
    count: number
) {
    const results = chars.map(s => new Results(
        s.character,
        s.initialDonation
    ));
    
    for (let _ = 0; _ < count; _++) {
        for (let __ = 0; __ < 1000; __++){
            const reel = fight(chars).reel.map(e => e.fight);
            reelToResults(results, reel, chars);
            if (reel.find(e =>
                e.type === 'death'
                && e.targetID === chars[0].id
            ) !== undefined)
                break;
        }
    }

    return results;
}

export function resultCount() {
    const chars = [
        pickCharacter({
            id: '0',
            name: 'shawn',
            amount: Number(process.argv[3]),
            profileImageURL: 'hello, i\'m a url',
            bossMessage: 'yo',
            bossEmoticonURL: 'hey',
            bitBossCheerMote: true
        }, Number(process.argv[2]), {}),
        pickCharacter({
            id: '1',
            name: 'hao',
            amount: Number(process.argv[5]),
            profileImageURL: 'hello, i\'m a url',
            bossMessage: 'yo',
            bossEmoticonURL: 'hey',
            bitBossCheerMote: true
        }, Number(process.argv[4]), {})
    ];

    const count = Number(process.argv[7])

    let results = countPairStats(chars, count);

    printResults(results);
    console.log(`average kills, ${ results[1].losses / results[0].losses }`)
}
