import * as Buff from './buff';
import { Status, Stats } from '../shared/Status';

export const artURLs = [
    "images/champions/0scullery_maid.png",
    "images/champions/1barkeep.png",
    "images/champions/2medium.png",
    "images/champions/3minstrel.png",        
    "images/champions/4mage.png", 
    "images/champions/5rogue.png",
    "images/champions/6warpriest.png",
    "images/champions/7warlock.png",  
    "images/champions/8swashbuckler.png",    
    "images/champions/9dragon.png",  
];

export const buffArt = [
    "images/icons/buffs/mop_up.png",
    "images/icons/buffs/last_call.png",
    "images/icons/buffs/medium_buff.png",
    "images/icons/buffs/blinding_chord.png",
    "images/icons/buffs/magic_missile.png",
    "images/icons/buffs/backstabbing.png",
    "images/icons/buffs/curse.png",
    "images/icons/buffs/damnation_buff.png",
    "images/icons/buffs/damnation_debuff.png",
    "images/icons/buffs/whirling_blades.png",
    "images/icons/buffs/firebreathing.png"
];

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

export const enum characterTypes {
    scullaryMaid    = 0,
    barkeep         = 1,
    medium          = 2,
    minstrel        = 3,
    mage            = 4,
    rogue           = 5,
    warpriest       = 6,
    warlock         = 7,
    swashbuckler    = 8,
    dragon          = 9,
}

export const characters: Character[] = [
    {
        stats: { 
            maxHitPoints: 400,
            accuracy: 100,
            dodge: 50,
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
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 15,
            debuff: Buff.buffs[Buff.types.sculleryMaid],
        },
        /*{
            odds: 15,
            debuff: Buff.buffs[Buff.types.sculleryMaid1],
        }*/
    ],
        name: 'Scullery Maid'
    }, // Scullery Maid
    {
        stats: { 
            maxHitPoints: 1200,
            accuracy: 100,
            dodge: 50,
            attackSpeed: {
                min: 625,
                max: 1250,
            },
            attackDamage: {
                min: 50,
                max: 75,
            },
            armor: 10,
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
            accuracy: 110,
            dodge: 55,
            attackSpeed: {
                min: 400,
                max: 800,
            },
            attackDamage: {
                min: 40,
                max: 55,
            },
            armor: 5,
            regeneration: 300,
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
            buff: Buff.buffs[Buff.types.medium],
        }],
        name: 'Medium'
    }, // Medium
    {
        stats: { 
            maxHitPoints: 1000,
            accuracy: 110,
            dodge: 55,
            attackSpeed: {
                min: 375,
                max: 750,
            },
            attackDamage: {
                min: 40,
                max: 60,
            },
            armor: 7,
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
            buff: Buff.buffs[Buff.types.minstrel],
        }],
        name: 'Minstrel'
    },
    {
        stats: { 
            maxHitPoints: 925,
            accuracy: 140,
            dodge: 40,
            attackSpeed: {
                min: 250,
                max: 500,
            },
            attackDamage: {
                min: 35,
                max: 50,
            },
            armor: 10,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 1,
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
            accuracy: 120,
            dodge: 60,
            attackSpeed: {
                min: 300,
                max: 600,
            },
            attackDamage: {
                min: 33,
                max: 48,
            },
            armor: 8,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 1,
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
            maxHitPoints: 1400,
            accuracy: 100,
            dodge: 50,
            attackSpeed: {
                min: 550,
                max: 1150,
            },
            attackDamage: {
                min: 40,
                max: 55,
            },
            armor: 20,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 1,
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
    {
        stats: { 
            maxHitPoints: 1350,
            accuracy: 65,
            dodge: 35,
            attackSpeed: {
                min: 1000,
                max: 1500,
            },
            attackDamage: {
                min: 95,
                max: 150,
            },
            armor: 13,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 2,
        crits: [{
            damageMultiplier: 4,
            odds: 8,
        },
        {
            odds: 20,
            buff: Buff.buffs[Buff.types.warlockBuff],
            debuff: Buff.buffs[Buff.types.warlockDebuff],
        }],
        name: 'Warlock'
    }, // Warlock
    {
        stats: { 
            maxHitPoints: 1250,
            accuracy: 110,
            dodge: 65,
            attackSpeed: {
                min: 450,
                max: 900,
            },
            attackDamage: {
                min: 45,
                max: 70,
            },
            armor: 8,
            regeneration: 300,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 2,
        crits: [{
            damageMultiplier: 4,
            odds: 6,
        },
        {
            odds: 10,
            buff: Buff.buffs[Buff.types.swashbucklerBuff],
        }],
        name: 'Swashbuckler'
    }, // Swashbuckler
    {
        stats: { 
            maxHitPoints: 2500,
            accuracy: 50,
            dodge: 10,
            attackSpeed: {
                min: 2000,
                max: 4000,
            },
            attackDamage: {
                min: 180,
                max: 560,
            },
            armor: 10,
            regeneration: 400,
            critChanceModifier: 1,
            critDamageModifier: 1,
        }, 
        rarity: 3,
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
export function pickCharacter(donation: {
    id: number, 
    name: string,
    amount: number,
    character: number,
    profileImageURL: string,
    chatMessage: string
}) : Status {
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
        stats,
        donation.profileImageURL,
        donation.chatMessage
    )
}
