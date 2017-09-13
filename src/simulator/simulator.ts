// node
import * as process from 'process';
// npm
import * as Fight from '../Fight';
import { pickCharacter } from '../ClassPicker';
import * as FightReel from '../FightReel';


console.log(process.argv);

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
        art: results[0].classType
    }),
    pickCharacter({
        id: 1,
        name: 'hao',
        amount: results[1].bits,
        art: results[1].classType
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

for (let key in results[0]) {
    console.log(`${ key }, ${ results[0][key] }, ${ results[1][key] }`);
}
