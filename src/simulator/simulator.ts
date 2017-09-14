// node
import * as process from 'process';
// internal
import * as Fight from '../shared/fight';
import { pickCharacter } from '../shared/characterPicker';
import * as FightReel from '../shared/fightReel';

class Results {
    hits = 0;
    miss = 0;
    total_damage = 0;
    crits = 0;
    wins = 0;
    losses = 0;

    constructor(
        public readonly classType: number,
        public readonly bits: number
    ) {}

    get average_damage() {
        return this.total_damage / ( this.wins + this.losses );
    }
}

let results = [
    new Results(
        Number(process.argv[2]),
        Number(process.argv[3])
    ),
    new Results(
        Number(process.argv[4]),
        Number(process.argv[5])
    )
];

let chars = [
    pickCharacter({
        id: 0,
        name: 'shawn',
        amount: results[0].bits,
        character: results[0].classType
    }),
    pickCharacter({
        id: 1,
        name: 'hao',
        amount: results[1].bits,
        character: results[1].classType
    })
];

let fights = Number(process.argv[6]);

function other(char: number) {
    switch (char) {
        case 0:
            return 1;
        case 1:
            return 0;
        default:
            console.error('bad character');
            process.exit();
            return -1; // typescript does not recognise exit
    }
}

for (let i = 0; i < fights; i++) {
    let reel = Fight.buildFightReel([chars[0], chars[1]]);

    if (reel == undefined) {
        process.exit();
        break; //typescript does not recognise process.exit()
    }

    for (let event of reel.reel) {
        switch (event.type) {
            case FightReel.EventType.damage:
                results[other(event.character)].total_damage += (<FightReel.DamageEvent>event).amount;
                results[other(event.character)].hits++;
                break;
            case FightReel.EventType.dodge:
                results[other(event.character)].miss++;
                break;
            case FightReel.EventType.healing:

                break;
            case FightReel.EventType.death:
                results[event.character].losses++;
                results[other(event.character)].wins++;
                break;
            default:
                console.log('bad event type');
                process.exit();
        }
    }
}

console.log(`classType, ${ results[0].classType }, ${ results[1].classType }`);
console.log(`hits, ${ results[0].hits }, ${ results[1].hits }`);
console.log(`miss, ${ results[0].miss }, ${ results[1].miss }`);
console.log(`total_damage, ${ results[0].total_damage }, ${ results[1].total_damage }`);
console.log(`crits, ${ results[0].crits }, ${ results[1].crits }`);
console.log(`wins, ${ results[0].wins }, ${ results[1].wins }`);
console.log(`losses, ${ results[0].losses }, ${ results[1].losses }`);
console.log(`average_damage, ${ results[0].average_damage }, ${ results[1].average_damage }`);
