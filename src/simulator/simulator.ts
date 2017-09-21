// node
import * as process from 'process';
// internal
import * as Fight from '../shared/fight';
import * as FightEvents from '../shared/fightEvents';
import { testPair } from './testPair';
import * as characterPicker from '../shared/characterPicker';

import { resultStats } from './resultStats';

function buildPairs<T, Y>(arr1: T[], arr2: Y[]) : {v1: number, v2: number}[] {
    let pairs: {v1: number, v2: number}[] = [];

    for (let v1 = 0; v1 < arr1.length; v1++) {
        for (let v2 = 0; v2 < arr2.length; v2++) {
            pairs.push({
                v1: Number(v1),
                v2: Number(v2)
            });
        }
    }
    return pairs;
}

if (process.argv.length == 7 && process.argv[6] === 'reel') {
} else if (process.argv.length == 7) {
    resultStats()
} else if (process.argv.length === 3) {
    const pairs = buildPairs(characterPicker.characters, characterPicker.levels);
    const testCount = Number(process.argv[2]);

    // top key
    for (let pair of pairs)
        process.stdout.write(`, ${ characterPicker.characters[pair.v1].name }: ${ pair.v2 }`);
    process.stdout.write('\n');

    for (let character1 of pairs) {
        process.stdout.write(`${ characterPicker.characters[character1.v1].name }: ${ character1.v2 }`)
        for (let character2 of pairs) {
            const results = testPair(
                [
                    characterPicker.pickCharacter({
                        id: 0,
                        name: 'shawn',
                        amount: characterPicker.levels[character2.v2].bits,
                        character: character2.v1
                    }),
                    characterPicker.pickCharacter({
                        id: 1,
                        name: 'hao',
                        amount: characterPicker.levels[character1.v2].bits,
                        character: character1.v1
                    })
                ],
                testCount
            );
            process.stdout.write(`, ${ results[1].wins / testCount }`)
        }
        process.stdout.write('\n');
    }
} else {
    console.log('enter number of tests to run');
}
