import { pickCharacter } from '../shared/characterPicker';
import { buildEvents } from '../shared/buildEvents';
import * as FightEvents from '../shared/fightEvents';
import { stdout } from 'process';
import { buffs } from '../shared/interfaces/buff';
import { Results, reelToResults, printResults } from './testPair';

function printReel(reel: FightEvents.Event[]) {

    console.log('####### EVENTS #######');

    for (let event of reel) {
        stdout.write(`time: ${ event.time.toPrecision(6) }, char: ${ event.character }, `);
        switch (event.type) {
            case FightEvents.Types.damage:
                stdout.write(`damage: ${ (<FightEvents.Damage>event).amount }\n`)
                break;
            case FightEvents.Types.dodge:
                stdout.write('dodge\n');
                break;
            case FightEvents.Types.healing:
                stdout.write(`healing: ${ (<FightEvents.Healing>event).amount }\n`);
                break;
            case FightEvents.Types.death:
                stdout.write('death\n');
                break;
            case FightEvents.Types.crit:
                const crit = (<FightEvents.Crit>event);
                const buff = crit.buff ? buffs.indexOf(crit.buff) : -1;
                const debuff = crit.debuff ? buffs.indexOf(crit.debuff) : -1;

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
            bossEmoticonURL: 'hey'
        }, Number(process.argv[2])),
        pickCharacter({
            id: 1,
            name: 'hao',
            amount: Number(process.argv[5]),
            profileImageURL: 'hello, i\'m a url',
            bossMessage: 'yo',
            bossEmoticonURL: 'hey'
        }, Number(process.argv[4]))
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
