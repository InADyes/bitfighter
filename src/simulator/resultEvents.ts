import { characterSheets } from '../shared/globals/characterSheets';
import { pickCharacter } from '../shared/characterPicker';
import { fight } from '../shared/fight';
import { FightEvent } from '../shared/interfaces/fightEvents';
import { stdout } from 'process';
import { buffs } from '../shared/interfaces/buff';
import { Results, reelToResults, printResults } from './testPair';

function printReel(reel: FightEvent[]) {

    console.log('####### EVENTS #######');

    for (let event of reel) {
        stdout.write(`time: ${ event.time.toPrecision(6) }, char: ${ event.targetID }, `);
        switch (event.type) {
            case 'damage':
                stdout.write(`damage: ${ event.amount }\n`)
                break;
            case 'dodge':
                stdout.write('dodge\n');
                break;
            case 'heal':
                stdout.write(`healing: ${ event.amount }\n`);
                break;
            case 'death':
                stdout.write('death\n');
                break;
            case 'crit':
                const buff = event.buff ? event.buff.name : 'none';
                const debuff = event.debuff ? event.debuff.name : 'none';

                stdout.write(`crit: (buff: ${ buff }, debuff: ${ debuff })\n`)
                break;
            default:
                stdout.write('unidentified event type\n');
        }
    }

    console.log('###### EVENTS END ######');

}

export function resultEvents() {
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

    const reel = fight(chars).reel.map(e => e.fight);
    printReel(reel);

    const results = reelToResults(
        chars.map(s => new Results(
            characterSheets.indexOf(s.character),
            s.initialDonation
        )),
        reel,
        chars
    )

    printResults(results);
}
