// node
import * as process from 'process';
// internal
import * as Fight from '../shared/fight';
import * as FightEvents from '../shared/fightEvents';
import { testPair } from './testPair';
import * as characterPicker from '../shared/characterPicker';

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

if (process.argv.length >= 7)
{
    const results = testPair(
        // {
        //     classType: Number(process.argv[2]),
        //     bits: Number(process.argv[3])
        // },
        // {
        //     classType: Number(process.argv[4]),
        //     bits: Number(process.argv[5])
        // },
        [
            characterPicker.pickCharacter({
                id: 0,
                name: 'shawn',
                amount: Number(process.argv[3]),
                character: Number(process.argv[2])
            }),
            characterPicker.pickCharacter({
                id: 1,
                name: 'hao',
                amount: Number(process.argv[5]),
                character: Number(process.argv[4])
            })
        ],
        Number(process.argv[6])
    )

    console.log(`classType, ${ results[0].classType }, ${ results[1].classType }`);
    console.log(`hits, ${ results[0].hits }, ${ results[1].hits }`);
    console.log(`miss, ${ results[0].miss }, ${ results[1].miss }`);
    console.log(`total_damage, ${ results[0].total_damage }, ${ results[1].total_damage }`);
    console.log(`crits, ${ results[0].crits }, ${ results[1].crits }`);
    console.log(`wins, ${ results[0].wins }, ${ results[1].wins }`);
    console.log(`losses, ${ results[0].losses }, ${ results[1].losses }`);
    console.log(`average_damage, ${ results[0].average_damage }, ${ results[1].average_damage }`);
} else if (process.argv.length >= 3){
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
