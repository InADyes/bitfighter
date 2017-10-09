import { testPair, printResults } from './testPair'
import { pickCharacter } from '../shared/characterPicker';

export function resultStats() {
    const results = testPair(
        [
            pickCharacter({
                id: 0,
                name: 'shawn',
                amount: Number(process.argv[3]),
                profileImageURL: 'hello, i\'m a url',
                bossMessage: 'yo',
                bossEmoticonURL: ''
            }, Number(process.argv[2])),
            pickCharacter({
                id: 1,
                name: 'hao',
                amount: Number(process.argv[5]),
                profileImageURL: 'hello, i\'m a url',
                bossMessage: 'yo',
                bossEmoticonURL: ''
            }, Number(process.argv[4]))
        ],
        Number(process.argv[6])
    )
    printResults(results);
}
