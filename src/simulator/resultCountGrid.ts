import { characters, pickCharacter, levels } from '../shared/characterPicker';
import { countPairStats } from './resultCount';
import { stdout } from 'process';

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

export function resultCountGrid() {
    const pairs = buildPairs(characters, levels);
    const testCount = Number(process.argv[2]);

    // top key
    for (let pair of pairs)
        stdout.write(`, ${ characters[pair.v1].name }: ${ pair.v2 }`);
    stdout.write('\n');

    for (let character1 of pairs) {
        stdout.write(`${ characters[character1.v1].name }: ${ character1.v2 }`)
        for (let character2 of pairs) {
            const results = countPairStats(
                [
                    pickCharacter({
                        id: '0',
                        name: 'shawn',
                        amount: levels[character2.v2].bits,
                        profileImageURL: 'hello, i\'m a url',
                        bossMessage: 'yo',
                        bossEmoticonURL: 'hey',
                        bitBossCheerMote: true
                    }, character2.v1, {}),
                    pickCharacter({
                        id: '1',
                        name: 'hao',
                        amount: levels[character1.v2].bits,
                        profileImageURL: 'hello, i\'m a url',
                        bossMessage: 'yo',
                        bossEmoticonURL: 'hey',
                        bitBossCheerMote: true
                    }, character1.v1, {})
                ],
                testCount
            );
            stdout.write(`, ${ results[0].losses / results[1].losses }`)
        }
        stdout.write('\n');
    }
}
