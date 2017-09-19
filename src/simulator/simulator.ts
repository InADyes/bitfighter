// node
import * as process from 'process';
// internal
import * as Fight from '../shared/fight';
import * as characterPicker from '../shared/characterPicker';
import * as FightEvents from '../shared/fightEvents';

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
        return this.total_damage / ( this.hits + this.miss );
    }
}

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

function testPair(
    character1: {classType: number, bits: number},
    character2: {classType: number, bits: number},
    fights: number
) {
    let results = [
        new Results(
            Number(character1.classType),
            Number(character1.bits)
        ),
        new Results(
            Number(character2.classType),
            Number(character2.bits)
        )
    ];

    let chars = [
        characterPicker.pickCharacter({
            id: 0,
            name: 'shawn',
            amount: results[0].bits,
            character: results[0].classType
        }),
        characterPicker.pickCharacter({
            id: 1,
            name: 'hao',
            amount: results[1].bits,
            character: results[1].classType
        })
    ];

    for (let i = 0; i < fights; i++) {
        const {reel} = Fight.buildFightEvents([chars[0], chars[1]]);

        for (const event of reel) {
            switch (event.type) {
                case FightEvents.Types.damage:
                    results[other(event.character)].total_damage += (<FightEvents.Damage>event).amount;
                    results[other(event.character)].hits++;
                    break;
                case FightEvents.Types.dodge:
                    results[other(event.character)].miss++;
                    break;
                case FightEvents.Types.healing:
                    break;
                case FightEvents.Types.death:
                    results[event.character].losses++;
                    results[other(event.character)].wins++;
                    break;
                case FightEvents.Types.crit:
                    results[other(event.character)].crits++;
                    break;
                default:
                    break;
            }
        }
    }
    return results;
}

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
        {
            classType: Number(process.argv[2]),
            bits: Number(process.argv[3])
        },
        {
            classType: Number(process.argv[4]),
            bits: Number(process.argv[5])
        },
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
                {
                    classType: character2.v1,
                    bits: characterPicker.levels[character2.v2].bits
                },
                {
                    classType: character1.v1,
                    bits: characterPicker.levels[character1.v2].bits
                },
                testCount
            );
            process.stdout.write(`, ${ results[0].wins / testCount }`)
        }
        process.stdout.write('\n');
    }
} else {
    console.log('enter number of tests to run');
}
