import * as Buff from './buff';
import { Status, Stats } from '../shared/Status';

interface Character {
    stats: Stats,
    rarity: number,
    critDebuff?: Buff.Buff,
    critBuff?: Buff.Buff,
    name: string
}

export const characters: Character[] = [
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Scullary Maid'
    }, // 0: scullary maid
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Farmer'
    }, // 1: Farmer
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Barkeep'
    }, // 2: Barkeep
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Street Urchin'
    }, // 3: Street Urchin
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Aristocrat'
    }, // 4: Aristocrat
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Minstrel'
    }, // 5: Minstrel
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Mage'
    }, // 6: Mage
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Rogue'
    }, // 7: Rogue
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Gladiator'
    }, // 8: Gladiator
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Barbarian'
    }, // 9: Barbarian
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Priest'
    }, // 10: War Priest
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Werewolf'
    }, // 11: Werewolf
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Warlock'
    }, // 12: Warlock
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Paladin'
    }, // 13: Paladin
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Swashbuckler'
    }, // 14: Swashbuckler
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Dragon'
    }, //15: Dragon
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Angel'
    }, //16: Angel
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Lich'
    }, // 17: Lich
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
        }, 
        rarity: 0,
        critDebuff: Buff.buffs[Buff.types.replaceMeShawn],
        name: 'Phoenix'
    } // 18: Phoenix
];

// starting level of rarities
const rarityLevel = [
    1, // common
    3, // uncommon
    5, // rare
    7  // legendary
]

interface Level {
    //level: number;
    readonly bits: number;
    readonly accuracy: number;
    readonly dodge: number;
};

export const levels: Level[] = [
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

    return new Status(
        donation.id,
        donation.name,
        pick,
        donation.amount,
        character.stats.maxHitPoints + donation.amount,
        level,
        {
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
        }
    )
}
