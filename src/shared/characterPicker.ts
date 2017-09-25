import * as Buff from './buff';
import { Status, Stats } from '../shared/Status';

export interface Character {
    stats: Stats,
    rarity: number,
    crits: {
        odds: number,
        debuff?: Buff.Buff,
        buff?: Buff.Buff,
        damageMultiplier?: number
    }[],
    name: string
}

export const characters: Character[] = [
    {
        stats: { 
            maxHitPoints: 900,
            accuracy: 100,
            dodge: 100,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 10,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 8,
        },
        {
            odds: 5,
            buff: Buff.buffs[Buff.types.streetUrchin],
        }],
        name: 'Street Urchin'
    },
    {
        stats: { 
            maxHitPoints: 1000,
            accuracy: 125,
            dodge: 125,
            attackSpeed: {
                min: 1000,
                max: 2000,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 25,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 15,
            debuff: Buff.buffs[Buff.types.sculleryMaid],
        },
        {
            odds: 15,
            debuff: Buff.buffs[Buff.types.sculleryMaid1],
        }
    ],
        name: 'Scullery Maid'
    },
    {
        stats: { 
            maxHitPoints: 1100,
            accuracy: 100,
            dodge: 75,
            attackSpeed: {
                min: 1000,
                max: 2000,
            },
            attackDamage: {
                min: 100,
                max: 150,
            },
            armor: 35,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            debuff: Buff.buffs[Buff.types.farmer],
        }],
        name: 'Farmer'
    },
    {
        stats: { 
            maxHitPoints: 1200,
            accuracy: 100,
            dodge: 100,
            attackSpeed: {
                min: 1250,
                max: 2500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 50,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 8,
        },
        {
            odds: 8,
            debuff: Buff.buffs[Buff.types.barkeep],
        }],
        name: 'Barkeep'
    },
    {
        stats: { 
            maxHitPoints: 975,
            accuracy: 100,
            dodge: 100,
            attackSpeed: {
                min: 800,
                max: 1600,
            },
            attackDamage: {
                min: 75,
                max: 110,
            },
            armor: 0,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 20,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.streetUrchin],
        }],
        name: 'Aristocrat'
    },
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Minstrel'
    },
    {
        stats: { 
            maxHitPoints: 925,
            accuracy: 125,
            dodge: 50,
            attackSpeed: {
                min: 500,
                max: 1000,
            },
            attackDamage: {
                min: 60,
                max: 90,
            },
            armor: 0,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 25,
            buff: Buff.buffs[Buff.types.mage],
        }],
        name: 'Mage'
    }, // Mage
    {
        stats: { 
            maxHitPoints: 1250,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 600,
                max: 1200,
            },
            attackDamage: {
                min: 40,
                max: 80,
            },
            armor: 25,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 5,
        },
        {
            odds: 8,
            buff: Buff.buffs[Buff.types.rogue],
        }],
        name: 'Rogue'
    }, // Rogue
    {
        stats: { 
            maxHitPoints: 1000,
            accuracy: 125,
            dodge: 175,
            attackSpeed: {
                min: 1250,
                max: 2500,
            },
            attackDamage: {
                min: 105,
                max: 155,
            },
            armor: 65,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 9,
            odds: 3,
        },
        {
            odds: 10,
            buff: Buff.buffs[Buff.types.gladiator],
        }],
        name: 'Gladiator'
    }, // Gladiator
    {
        stats: { 
            maxHitPoints: 1800,
            accuracy: 100,
            dodge: 40,
            attackSpeed: {
                min: 1500,
                max: 3000,
            },
            attackDamage: {
                min: 150,
                max: 300,
            },
            armor: 10,
            regeneration: 500,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 7,
            odds: 4,
        },
        {
            odds: 4,
            buff: Buff.buffs[Buff.types.barbarian],
        }],
        name: 'Barbarian'
    }, // Barbarian
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Warpriest'
    }, // Warpriest
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Werewolf'
    }, // Werewolf
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Warlock'
    }, // Warlock
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Paladin'
    }, // Paladin
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Swashbuckler'
    }, // Swashbuckler
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Dragon'
    }, // Dragon
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Angel'
    }, // Angel
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Phoenix'
    }, // Phoenix
    {
        stats: { 
            maxHitPoints: 950,
            accuracy: 150,
            dodge: 150,
            attackSpeed: {
                min: 750,
                max: 1500,
            },
            attackDamage: {
                min: 90,
                max: 130,
            },
            armor: 15,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Lich'
    }, // Lich
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
    readonly damage: number;
    readonly health: number;
};

export const levels: Level[] = [
    {
        bits: 1, //todo: change to let streamer options define starting bit values
        damage: 0,
        health: 0,
    },// level 1
    // {
    //     bits: 500,
    //     damage: 5,
    //     health: 50,
    // },// level 2
    // {
    //     bits: 2000,
    //     damage: 5,
    //     health: 50,
    // },// level 3
    // {
    //     bits: 3500,
    //     damage: 5,
    //     health: 50,
    // },// level 4
    // {
    //     bits: 5000,
    //     damage: 5,
    //     health: 50,
    // },// level 5
    // {
    //     bits: 7500,
    //     damage: 5,
    //     health: 50,
    // },// level 6
    // {
    //     bits: 10000,
    //     damage: 5,
    //     health: 50,
    // },// level 7
    // {
    //     bits: 20000,
    //     damage: 5,
    //     health: 50,
    // },// level 8
    // {
    //     bits: 30000,
    //     damage: 5,
    //     health: 50,
    // },// level 9
    // {
    //     bits: 40000,
    //     damage: 5,
    //     health: 50,
    // },// level 10
];

export function buildStats(character: number, donation: number, level: number) : Stats {
    const c = characters[character];

    return {
        maxHitPoints: c.stats.maxHitPoints + (donation < 2000 ? donation / 4 : 500 + (donation - 2000) / 16),
        accuracy: c.stats.accuracy,
        dodge: c.stats.dodge,
        attackSpeed: {
            min: c.stats.attackSpeed.min,
            max: c.stats.attackSpeed.max
        },
        attackDamage: {
            min: c.stats.attackDamage.min,
            max: c.stats.attackDamage.max
        },
        armor: c.stats.armor,
        regeneration: c.stats.regeneration,
        critChanceModifier: c.stats.critChanceModifier,
        critDamageModifier: c.stats.critDamageModifier
    }
}

// i'm going to fix this i swear
// donation.amount is assumed to be in bits
export function pickCharacter(donation: {id: number, 
    name: string, amount: number, character: number}) : Status {
    let pick = donation.character % characters.length;

    let level = rarityLevel[characters[pick].rarity]; // 1 indexed

    // while we are not the highest level and we have the bits required to be the next level
    while (level < levels.length && donation.amount > levels[level].bits)
        level++;

    const stats = buildStats(pick, donation.amount, level);

    return new Status(
        donation.id,
        donation.name,
        pick,
        donation.amount,
        stats.maxHitPoints,
        level,
        stats
    )
}
