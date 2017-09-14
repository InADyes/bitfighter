import { Stats, Status } from 'statusTypes';

interface Character {
    stats: Stats,
    rarity: number
}

// still thinking about this
let characters: Character[] = [
    {
        stats: { 
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        }, // 0: scullary maid
        rarity: 0
    }
];

let rarityLevel = [
    1, // common
    3, // uncommon
    5, // rare
    7  // legendary
]

interface Level {
    //level: number;
    bits: number;
    accuracy: number;
    dodge: number;
};

let levels: Level[] = [
    {
        //level: 1,
        bits: 200, //todo: change to let streamer options define starting bit values
        accuracy: 0,
        dodge: 0,
    },
    {
        //level: 2,
        bits: 500,
        accuracy: 50,
        dodge: 50,
    }
];

// i'm going to fix this i swear
// donation.amount is assumed to be in bits
export function pickCharacter(donation: {id: number, name: string, amount: number, character: number}) : Status {
    let pick = donation.character % characters.length;
    let character = characters[pick];

    let level = rarityLevel[characters[pick].rarity]; // 1 indexed

    // while we are not the highest level and we have the bits required to be the next level
    while (level < levels.length && donation.amount > levels[level].bits)
        level++;

    return {
        id: donation.id,
        name: donation.name,
        donation: donation.amount,
        hitPoints: character.stats.maxHitPoints + donation.amount,
        character: pick,
        stats: {
            maxHitPoints: character.stats.maxHitPoints + donation.amount,
            accuracy: character.stats.accuracy + levels[level - 1].accuracy,
            dodge: character.stats.dodge + levels[level - 1].dodge,
            attackSpeed: {
                min: character.stats.attackSpeed.min,
                max: character.stats.attackSpeed.max
            },
            attackDamage: {
                min: character.stats.attackDamage.min,
                max: character.stats.attackDamage.max
            },
            armor: character.stats.armor,
            regeneration: character.stats.regeneration,
            crit: character.stats.crit
        },
        level: level
    }
}
