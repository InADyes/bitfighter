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
    // {
    //     stats: { 
    //         maxHitPoints: 900,
    //         accuracy: 100,
    //         dodge: 100,
    //         attackSpeed: {
    //             min: 750,
    //             max: 1500,
    //         },
    //         attackDamage: {
    //             min: 90,
    //             max: 130,
    //         },
    //         armor: 10,
    //         regeneration: 300,
    //         critChanceModifier: 1,
    //         critDamageModifier: 1,
    //     }, 
    //     rarity: 0,
    //     crits: [{
    //         damageMultiplier: 4,
    //         odds: 8,
    //     },
    //     {
    //         odds: 5,
    //         buff: Buff.buffs[Buff.types.streetUrchin],
    //     }],
    //     name: 'Street Urchin'
    // },
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
            odds: 15,
            debuff: Buff.buffs[Buff.types.sculleryMaid],
        },
        {
            odds: 15,
            debuff: Buff.buffs[Buff.types.sculleryMaid1],
        }
    ],
        name: 'Scullery Maid'
    }, // Scullery Maid
    // {
    //     stats: { 
    //         maxHitPoints: 1100,
    //         accuracy: 100,
    //         dodge: 75,
    //         attackSpeed: {
    //             min: 1000,
    //             max: 2000,
    //         },
    //         attackDamage: {
    //             min: 100,
    //             max: 150,
    //         },
    //         armor: 35,
    //         regeneration: 300,
    //         critChanceModifier: 1,
    //         critDamageModifier: 1,
    //     }, 
    //     rarity: 0,
    //     crits: [{
    //         damageMultiplier: 4,
    //         odds: 6,
    //     },
    //     {
    //         odds: 6,
    //         debuff: Buff.buffs[Buff.types.farmer],
    //     }],
    //     name: 'Farmer'
    // },
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
            armor: 30,
            regeneration: 300,
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
    }, // Barkeep
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
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 15,
        crits: [{
            damageMultiplier: 4,
            odds: 20,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.streetUrchin],
        }],
        name: 'Medium'
    }, // Medium
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
                min: 70,
                max: 100,
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
            odds: 45,
            debuff: Buff.buffs[Buff.types.mage],
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
            armor: 20,
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
    // {
    //     stats: { 
    //         maxHitPoints: 1000,
    //         accuracy: 125,
    //         dodge: 175,
    //         attackSpeed: {
    //             min: 1250,
    //             max: 2500,
    //         },
    //         attackDamage: {
    //             min: 105,
    //             max: 155,
    //         },
    //         armor: 65,
    //         regeneration: 300,
    //         critChanceModifier: 1,
    //         critDamageModifier: 1,
    //     }, 
    //     rarity: 0,
    //     crits: [{
    //         damageMultiplier: 9,
    //         odds: 3,
    //     },
    //     {
    //         odds: 10,
    //         buff: Buff.buffs[Buff.types.gladiator],
    //     }],
    //     name: 'Gladiator'
    // }, // Gladiator
    // {
    //     stats: { 
    //         maxHitPoints: 1800,
    //         accuracy: 100,
    //         dodge: 40,
    //         attackSpeed: {
    //             min: 1500,
    //             max: 3000,
    //         },
    //         attackDamage: {
    //             min: 150,
    //             max: 300,
    //         },
    //         armor: 10,
    //         regeneration: 500,
    //         critChanceModifier: 1,
    //         critDamageModifier: 1,
    //     }, 
    //     rarity: 0,
    //     crits: [{
    //         damageMultiplier: 7,
    //         odds: 4,
    //     },
    //     {
    //         odds: 4,
    //         buff: Buff.buffs[Buff.types.barbarian],
    //     }],
    //     name: 'Barbarian'
    // }, // Barbarian
    {
        stats: { 
            maxHitPoints: 1400,
            accuracy: 75,
            dodge: 150,
            attackSpeed: {
                min: 1000,
                max: 2000,
            },
            attackDamage: {
                min: 100,
                max: 140,
            },
            armor: 40,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 3,
        },
        {
            odds: 6,
            buff: Buff.buffs[Buff.types.warpriest],
        }],
        name: 'Warpriest'
    }, // Warpriest
    // {
    //     stats: { 
    //         maxHitPoints: 1600,
    //         accuracy: 175,
    //         dodge: 75,
    //         attackSpeed: {
    //             min: 500,
    //             max: 1000,
    //         },
    //         attackDamage: {
    //             min: 90,
    //             max: 130,
    //         },
    //         armor: 35,
    //         regeneration: 800,
    //         critChanceModifier: 1,
    //         critDamageModifier: 1,
    //     }, 
    //     rarity: 0,
    //     crits: [{
    //         damageMultiplier: 2,
    //         odds: 10,
    //     },
    //     {
    //         odds: 7,
    //         buff: Buff.buffs[Buff.types.werewolfBuff],
    //     }],
    //     name: 'Werewolf'
    // }, // Werewolf
    {
        stats: { 
            maxHitPoints: 1350,
            accuracy: 75,
            dodge: 75,
            attackSpeed: {
                min: 2000,
                max: 3000,
            },
            attackDamage: {
                min: 200,
                max: 350,
            },
            armor: 20,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 8,
        },
        {
            odds: 25,
            buff: Buff.buffs[Buff.types.warlockBuff],
            debuff: Buff.buffs[Buff.types.warlockDebuff],
        }],
        name: 'Warlock'
    }, // Warlock
    // {
    //     stats: { 
    //         maxHitPoints: 1700,
    //         accuracy: 125,
    //         dodge: 150,
    //         attackSpeed: {
    //             min: 1250,
    //             max: 2500,
    //         },
    //         attackDamage: {
    //             min: 120,
    //             max: 160,
    //         },
    //         armor: 80,
    //         regeneration: 300,
    //         critChanceModifier: 1,
    //         critDamageModifier: 1,
    //     }, 
    //     rarity: 0,
    //     crits: [{
    //         damageMultiplier: 2,
    //         odds: 15,
    //     },
    //     {
    //         odds: 5,
    //         buff: Buff.buffs[Buff.types.paladin],
    //     }],
    //     name: 'Paladin'
    // }, // Paladin
    {
        stats: { 
            maxHitPoints: 1000,
            accuracy: 90,
            dodge: 130,
            attackSpeed: {
                min: 1100,
                max: 2200,
            },
            attackDamage: {
                min: 60,
                max: 80,
            },
            armor: 10,
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
            odds: 8,
            buff: Buff.buffs[Buff.types.swashbucklerBuff],
        }],
        name: 'Swashbuckler'
    }, // Swashbuckler
    {
        stats: { 
            maxHitPoints: 2500,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 3000,
                max: 6000,
            },
            attackDamage: {
                min: 400,
                max: 1200,
            },
            armor: 50,
            regeneration: 400,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 2,
            odds: 25,
        },
        {
            odds: 25,
            debuff: Buff.buffs[Buff.types.dragon],
        }],
        name: 'Dragon'
    }, // Dragon
    // {
    //     stats: { 
    //         maxHitPoints: 2000,
    //         accuracy: 100,
    //         dodge: 250,
    //         attackSpeed: {
    //             min: 3000,
    //             max: 6000,
    //         },
    //         attackDamage: {
    //             min: 200,
    //             max: 600,
    //         },
    //         armor: 0,
    //         regeneration: 600,
    //         critChanceModifier: 1,
    //         critDamageModifier: 1,
    //     }, 
    //     rarity: 0,
    //     crits: [{
    //         damageMultiplier: 6,
    //         odds: 4,
    //     },
    //     {
    //         odds: 20,
    //         buff: Buff.buffs[Buff.types.angel],
    //     }],
    //     name: 'Angel'
    // }, // Angel
    // {
    //     stats: { 
    //         maxHitPoints: 2000,
    //         accuracy: 150,
    //         dodge: 75,
    //         attackSpeed: {
    //             min: 500,
    //             max: 1000,
    //         },
    //         attackDamage: {
    //             min: 70,
    //             max: 120,
    //         },
    //         armor: 30,
    //         regeneration: 300,
    //         critChanceModifier: 1,
    //         critDamageModifier: 1,
    //     }, 
    //     rarity: 0,
    //     crits: [{
    //         damageMultiplier: 4,
    //         odds: 6,
    //     },
    //     {
    //         odds: 1,
    //         buff: Buff.buffs[Buff.types.phoenix],
    //     },
    //     {
    //         odds: 20,
    //         debuff: Buff.buffs[Buff.types.phoenix1],
    //     }],
    //     name: 'Phoenix'
    // }, // Phoenix
    // {
    //     stats: { 
    //         maxHitPoints: 1000,
    //         accuracy: 200,
    //         dodge: 200,
    //         attackSpeed: {
    //             min: 1000,
    //             max: 2000,
    //         },
    //         attackDamage: {
    //             min: 90,
    //             max: 130,
    //         },
    //         armor: 70,
    //         regeneration: 300,
    //         critChanceModifier: 1,
    //         critDamageModifier: 1,
    //     }, 
    //     rarity: 0,
    //     crits: [{
    //         damageMultiplier: 6,
    //         odds: 10,
    //     },
    //     {
    //         odds: 10,
    //         buff: Buff.buffs[Buff.types.lichBuff],
    //         debuff: Buff.buffs[Buff.types.lichDebuff]
    //     }],
    //     name: 'Lich'
    // }, // Lich
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
