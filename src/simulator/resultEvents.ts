import { pickCharacter } from '../shared/characterPicker';
import { buildEvents } from '../shared/buildEvents';
import { FightEvent } from '../shared/fightEvents';
import { stdout } from 'process';
import { buffs } from '../shared/interfaces/buff';
import { Results, reelToResults, printResults } from './testPair';

function printReel(reel: FightEvent[]) {

    console.log('####### EVENTS #######');

    for (let event of reel) {
        stdout.write(`time: ${ event.time.toPrecision(6) }, char: ${ event.character }, `);
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
                const buff = event.buff ? buffs.indexOf(event.buff) : -1;
                const debuff = event.debuff ? buffs.indexOf(event.debuff) : -1;

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
            id: 0,
            name: 'shawn',
            amount: Number(process.argv[3]),
            profileImageURL: 'hello, i\'m a url',
            bossMessage: 'yo',
            bossEmoticonURL: 'hey',
            bitBossCheerMote: true
        }, Number(process.argv[2]), {}),
        pickCharacter({
            id: 1,
            name: 'hao',
            amount: Number(process.argv[5]),
            profileImageURL: 'hello, i\'m a url',
            bossMessage: 'yo',
            bossEmoticonURL: 'hey',
            bitBossCheerMote: true
        }, Number(process.argv[4]), {})
    ];

    const reel = buildEvents(chars).reel.map(e => e.fight);
    printReel(reel);

    const results = reelToResults(
        chars.map(s => new Results(
            s.character,
            s.initialDonation
        )),
        reel
    )

    printResults(results);
}
