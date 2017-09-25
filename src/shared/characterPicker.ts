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
            maxHitPoints: 400,
            accuracy: 75,
            dodge: 75,
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
            damageMultiplier: 10,
            odds: 10,
            buff: Buff.buffs[Buff.types.streetUrchin],
        }],
        name: 'Street Urchin'
    }, // 0: Street Urchin
    {
        stats: { 
            maxHitPoints: 400,
            accuracy: 100,
            dodge: 75,
            attackSpeed: {
                min: 1100,
                max: 2200,
            },
            attackDamage: {
                min: 100,
                max: 150,
            },
            armor: 30,
            regeneration: 400,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 6,
            odds: 10,
            debuff: Buff.buffs[Buff.types.sculleryMaid],
        }],
        name: 'Scullary Maid'
    }, // 1: scullary maid
    {
        stats: { 
            maxHitPoints: 550,
            accuracy: 50,
            dodge: 75,
            attackSpeed: {
                min: 1250,
                max: 2500,
            },
            attackDamage: {
                min: 120,
                max: 180,
            },
            armor: 25,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 6,
            odds: 10,
            debuff: Buff.buffs[Buff.types.farmer],
        }],
        name: 'Farmer'
    }, // 2: Farmer
    {
        stats: { 
            maxHitPoints: 700,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1100,
                max: 2200,
            },
            attackDamage: {
                min: 100,
                max: 130,
            },
            armor: 45,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 10,
            debuff: Buff.buffs[Buff.types.barkeep],
        }],
        name: 'Barkeep'
    }, // 3: Barkeep
    {
        stats: { 
            maxHitPoints: 300,
            accuracy: 100,
            dodge: 150,
            attackSpeed: {
                min: 1300,
                max: 2600,
            },
            attackDamage: {
                min: 80,
                max: 120,
            },
            armor: 0,
            regeneration: 100,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 0,
        crits: [{
            damageMultiplier: 4,
            odds: 10,
            debuff: Buff.buffs[Buff.types.aristocrat],
        }],
        name: 'Aristocrat'
    }, // 4: Aristocrat
    {
        stats: { 
            maxHitPoints: 400,
            accuracy: 100,
            dodge: 75,
            attackSpeed: {
                min: 1300,
                max: 2600,
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
            odds: 10,
            debuff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Minstrel'
    }, // 5: Minstrel
    {
        stats: { 
            maxHitPoints: 400,
            accuracy: 50,
            dodge: 125,
            attackSpeed: {
                min: 500,
                max: 1000,
            },
            attackDamage: {
                min: 50,
                max: 60,
            },
            armor: 25,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 1,
        crits: [{
            damageMultiplier: 3,
            odds: 10,
            debuff: Buff.buffs[Buff.types.mage],
        }],
        name: 'Mage'
    }, // 6: Mage
    {
        stats: { 
            maxHitPoints: 600,
            accuracy: 125,
            dodge: 90,
            attackSpeed: {
                min: 800,
                max: 1600,
            },
            attackDamage: {
                min: 75,
                max: 175,
            },
            armor: 30,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 1,
        crits: [{
            damageMultiplier: 20,
            odds: 10,
            buff: Buff.buffs[Buff.types.rogue],
        }],
        name: 'Rogue'
    }, // 7: Rogue
    {
        stats: { 
            maxHitPoints: 900,
            accuracy: 100,
            dodge: 150,
            attackSpeed: {
                min: 1500,
                max: 3000,
            },
            attackDamage: {
                min: 100,
                max: 200,
            },
            armor: 50,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 1,
        crits: [{
            damageMultiplier: 6,
            odds: 10,
            debuff: Buff.buffs[Buff.types.gladiator],
        }],
        name: 'Gladiator'
    }, // 8: Gladiator
    {
        stats: { 
            maxHitPoints: 1400,
            accuracy: 25,
            dodge: 100,
            attackSpeed: {
                min: 1700,
                max: 3400,
            },
            attackDamage: {
                min: 145,
                max: 290,
            },
            armor: 10,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 1,
        crits: [{
            damageMultiplier: 8,
            odds: 10,
            buff: Buff.buffs[Buff.types.barbarian],
        }],
        name: 'Barbarian'
    }, // 9: Barbarian
    {
        stats: { 
            maxHitPoints: 600,
            accuracy: 100,
            dodge: 100,
            attackSpeed: {
                min: 1400,
                max: 2800,
            },
            attackDamage: {
                min: 110,
                max: 165,
            },
            armor: 45,
            regeneration: 1000,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 1,
        crits: [{
            damageMultiplier: 2,
            odds: 10,
            debuff: Buff.buffs[Buff.types.warpriest]
        }],
        name: 'War Priest'
    }, // 10: War Priest
    {
        stats: { 
            maxHitPoints: 600,
            accuracy: 250,
            dodge: 125,
            attackSpeed: {
                min: 1500,
                max: 3000,
            },
            attackDamage: {
                min: 80,
                max: 120,
            },
            armor: 45,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 2,
        crits: [{
            damageMultiplier: 6,
            odds: 10,
            debuff: Buff.buffs[Buff.types.werewolfDebuff],
            buff: Buff.buffs[Buff.types.werewolfDebuff],
        }],
        name: 'Werewolf'
    }, // 11: Werewolf
    {
        stats: { 
            maxHitPoints: 600,
            accuracy: 50,
            dodge: 400,
            attackSpeed: {
                min: 3000,
                max: 6000,
            },
            attackDamage: {
                min: 200,
                max: 300,
            },
            armor: 15,
            regeneration: -200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 2,
        crits: [{
            damageMultiplier: 2,
            odds: 10,
            debuff: Buff.buffs[Buff.types.warlockDebuff],
        }],
        name: 'Warlock'
    }, // 12: Warlock
    {
        stats: { 
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 200,
            attackSpeed: {
                min: 1300,
                max: 2600,
            },
            attackDamage: {
                min: 95,
                max: 165,
            },
            armor: 65,
            regeneration: 400,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 2,
        crits: [{
            damageMultiplier: 10,
            odds: 10,
            buff: Buff.buffs[Buff.types.paladin],
        }],
        name: 'Paladin'
    }, // 13: Paladin
    {
        stats: { 
            maxHitPoints: 900,
            accuracy: 100,
            dodge: 100,
            attackSpeed: {
                min: 1300,
                max: 2600,
            },
            attackDamage: {
                min: 110,
                max: 170,
            },
            armor: 55,
            regeneration: 200,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 2,
        crits: [{
            damageMultiplier: 8,
            odds: 10,
            debuff: Buff.buffs[Buff.types.swashbucklerDebuff],
            buff: Buff.buffs[Buff.types.swashbucklerBuff],
        }],
        name: 'Swashbuckler'
    }, // 14: Swashbuckler
    {
        stats: { 
            maxHitPoints: 3000,
            accuracy: 10,
            dodge: 150,
            attackSpeed: {
                min: 5000,
                max: 7000,
            },
            attackDamage: {
                min: 550,
                max: 1100,
            },
            armor: 85,
            regeneration: 0,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 3,
        crits: [{
            damageMultiplier: 20,
            odds: 10,
            debuff: Buff.buffs[Buff.types.dragon],
        }],
        name: 'Dragon'
    }, //15: Dragon
    // {
    //     stats: { 
    //         maxHitPoints: 1000,
    //         accuracy: 50,
    //         dodge: 50,
    //         attackSpeed: {
    //             min: 1000,
    //             max: 1750,
    //         },
    //         attackDamage: {
    //             min: 25,
    //             max: 50,
    //         },
    //         armor: 20,
    //         regeneration: 200,
    //         //critChance: 20,
    //     }, 
    //     rarity: 0,
    //          debuff: Buff.buffs[Buff.types.replaceMeShawn],
    //         damageMultiplier: 0,
    //     
    //  name: 'Angel'
    // }, //16: Angel
    // {
    //     stats: { 
    //         maxHitPoints: 1000,
    //         accuracy: 50,
    //         dodge: 50,
    //         attackSpeed: {
    //             min: 1000,
    //             max: 1750,
    //         },
    //         attackDamage: {
    //             min: 25,
    //             max: 50,
    //         },
    //         armor: 20,
    //         regeneration: 200,
    //         //critChance: 20,
    //     }, 
    //     rarity: 0,
    //          debuff: Buff.buffs[Buff.types.replaceMeShawn],  
    //         damageMultiplier: 0,
    //name: 'Lich'
    // }, // 17: Lich
    // {
    //     stats: { 
    //         maxHitPoints: 1000,
    //         accuracy: 50,
    //         dodge: 50,
    //         attackSpeed: {
    //             min: 1000,
    //             max: 1750,
    //         },
    //         attackDamage: {
    //             min: 25,
    //             max: 50,
    //         },
    //         armor: 20,
    //         regeneration: 200,
    //         //critChance: 20,
    //     }, 
    //     rarity: 0,
    //          debuff: Buff.buffs[Buff.types.replaceMeShawn],
    //         damageMultiplier: 0
    //     
    // name: 'Phoenix'
    // } // 18: Phoenix
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
        bits: 200, //todo: change to let streamer options define starting bit values
        damage: 5,
        health: 50,
    },// level 1
    {
        bits: 500,
        damage: 5,
        health: 50,
    },// level 2
    {
        bits: 2000,
        damage: 5,
        health: 50,
    },// level 3
    {
        bits: 3500,
        damage: 5,
        health: 50,
    },// level 4
    {
        bits: 5000,
        damage: 5,
        health: 50,
    },// level 5
    {
        bits: 7500,
        damage: 5,
        health: 50,
    },// level 6
    {
        bits: 10000,
        damage: 5,
        health: 50,
    },// level 7
    {
        bits: 20000,
        damage: 5,
        health: 50,
    },// level 8
    {
        bits: 30000,
        damage: 5,
        health: 50,
    },// level 9
    {
        bits: 40000,
        damage: 5,
        health: 50,
    },// level 10
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
