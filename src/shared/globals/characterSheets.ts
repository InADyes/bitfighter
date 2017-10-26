import * as Buff from '../interfaces/buff';
import { Character } from '../interfaces/interfaces';

export const characterSheets: Readonly<Character>[] = [
    {
        stats: { 
            maxHitPoints: 1000,
            accuracy: 110,
            dodge: 60,
            attackSpeed: {
                min: 500,
                max: 1000
            },
            attackDamage: {
                min: 45,
                max: 70
            },
            armor: 13,
            regeneration: 800,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'common',
        crits: [
            {
                damageMultiplier: 4,
                odds: 6
            },
            {
                odds: 15,
                debuff: Buff.buffs[Buff.types.sculleryMaid]
            },
        ],
        name: 'Scullery Maid',
        flavorText: 'You think fighting dragons is hard, try scrubbing castle floors!',
        skillText: 'DEBUFF Lowers Accuracy and Dodge'
    }, // Scullery Maid
    {
        stats: { 
            maxHitPoints: 1200,
            accuracy: 100,
            dodge: 50,
            attackSpeed: {
                min: 625,
                max: 1250
            },
            attackDamage: {
                min: 50,
                max: 75
            },
            armor: 13,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'common',
        crits: [
            {
                damageMultiplier: 4,
                odds: 8
            },
            {
                odds: 8,
                debuff: Buff.buffs[Buff.types.barkeep]
            }
        ],
        name: 'Barkeep',
        flavorText: 'They call my bar the Bongo, because you go there to get beaten.',
        skillText: 'DEBUFF Cripples Opponent'
    }, // Barkeep
    {
        stats: { 
            maxHitPoints: 925,
            accuracy: 110,
            dodge: 55,
            attackSpeed: {
                min: 400,
                max: 800
            },
            attackDamage: {
                min: 40,
                max: 65
            },
            armor: 7,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'common',
        crits: [
            {
                damageMultiplier: 4,
                odds: 20
            },
            {
                odds: 6,
                debuff: Buff.buffs[Buff.types.medium]
            }
        ],
        name: 'Medium',
        flavorText: 'Battles can be boring when you already know the outcome',
        skillText: 'DEBUFF Lowers Accuracy'
    }, // Medium
    {
        stats: { 
            maxHitPoints: 1000,
            accuracy: 110,
            dodge: 55,
            attackSpeed: {
                min: 400,
                max: 800
            },
            attackDamage: {
                min: 40,
                max: 70
            },
            armor: 8,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'common',
        crits: [
            {
                damageMultiplier: 4,
                odds: 6
            },
            {
                odds: 8,
                buff: Buff.buffs[Buff.types.minstrel]
            }
        ],
        name: 'Minstrel',
        flavorText: 'I deplore a battle wits with an unarmed opponent.',
        skillText: 'DEBUFF Blinds Enemy'
    },
    {
        stats: { 
            maxHitPoints: 925,
            accuracy: 110,
            dodge: 40,
            attackSpeed: {
                min: 350,
                max: 750
            },
            attackDamage: {
                min: 45,
                max: 80
            },
            armor: 8,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'uncommon',
        crits: [
            {
                damageMultiplier: 4,
                odds: 6
            },
            {
                odds: 20,
                debuff: Buff.buffs[Buff.types.mage]
            }
        ],
        name: 'Mage',
        flavorText: 'I put on my robe and my wizard hat...',
        skillText: 'DEBUFF Bypasses Armor'
    }, // Mage
    {
        stats: { 
            maxHitPoints: 1250,
            accuracy: 120,
            dodge: 60,
            attackSpeed: {
                min: 300,
                max: 600
            },
            attackDamage: {
                min: 35,
                max: 45
            },
            armor: 6,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'uncommon',
        crits: [
            {
                damageMultiplier: 4,
                odds: 5
            },
            {
                odds: 8,
                buff: Buff.buffs[Buff.types.rogue]
            }
        ],
        name: 'Rogue',
        flavorText: 'Rogues do it from behind',
        skillText: 'BUFF Dodges more Frequently'
    }, // Rogue
    {
        stats: { 
            maxHitPoints: 1500,
            accuracy: 100,
            dodge: 50,
            attackSpeed: {
                min: 550,
                max: 1150
            },
            attackDamage: {
                min: 40,
                max: 55
            },
            armor: 18,
            regeneration: 1200,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'uncommon',
        crits: [
            {
                damageMultiplier: 4,
                odds: 3
            },
            {
                odds: 6,
                buff: Buff.buffs[Buff.types.warpriest]
            }
        ],
        name: 'Warpriest',
        flavorText: 'It\'s only a fleshwound...',
        skillText: 'BUFF Gains Armor and Health'
    }, // Warpriest
    {
        stats: { 
            maxHitPoints: 1350,
            accuracy: 65,
            dodge: 30,
            attackSpeed: {
                min: 1000,
                max: 1500
            },
            attackDamage: {
                min: 95,
                max: 150
            },
            armor: 10,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'rare',
        crits: [
            {
                damageMultiplier: 4,
                odds: 8
            },
            {
                odds: 10,
                buff: Buff.buffs[Buff.types.warlockBuff],
                debuff: Buff.buffs[Buff.types.warlockDebuff]
            }
        ],
        name: 'Warlock',
        flavorText: 'Souls are like wine, they are better in a glass jar.',
        skillText: 'BUFF Critical Damage'
    }, // Warlock
    {
        stats: { 
            maxHitPoints: 1250,
            accuracy: 90,
            dodge: 65,
            attackSpeed: {
                min: 450,
                max: 900
            },
            attackDamage: {
                min: 45,
                max: 70
            },
            armor: 10,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'rare',
        crits: [
            {
                damageMultiplier: 4,
                odds: 6
            },
            {
                odds: 10,
                buff: Buff.buffs[Buff.types.swashbucklerBuff]
            }
        ],
        name: 'Swashbuckler',
        flavorText: 'I have sailed the 7 seas, slain skeletons and monsters and you want me to fight...a scullery maid and a barkeep?',
        skillText: 'BUFF Increases Accuracy and Dodge'
    }, // Swashbuckler
    {
        stats: { 
            maxHitPoints: 2000,
            accuracy: 70,
            dodge: 10,
            attackSpeed: {
                min: 1200,
                max: 2200
            },
            attackDamage: {
                min: 80,
                max: 150
            },
            armor: 5,
            regeneration: 800,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'mythic',
        crits: [
            {
                damageMultiplier: 6,
                odds: 40
            },
            {
                odds: 20,
                debuff: Buff.buffs[Buff.types.dragon]
            }
        ],
        name: 'Dragon',
        flavorText: 'If I wasn\'t supposed to eat adventurers, then why are they made of meat and treasure?',
        skillText: 'DEBUFF Removes Dodge'
    }, // Dragon
    {
        stats: { 
            maxHitPoints: 700,
            accuracy: 80,
            dodge: 35,
            attackSpeed: {
                min: 700,
                max: 1300
            },
            attackDamage: {
                min: 40,
                max: 60
            },
            armor: 8,
            regeneration: 600,
            critChanceModifier: 1,
            critDamageModifier: 1
        }, 
        rarity: 'graveDigger',
        crits: [
            {
                damageMultiplier: 5,
                odds: 8
            },
        ],
        name: 'Grave Digger',
        flavorText: 'The difference between the living and the dead...some dirt and a shovel.',
        skillText: ''
    }, // Grave Digger
    {
        stats: { 
            maxHitPoints: 0,
            accuracy: 0,
            dodge: 0,
            attackSpeed: {
                min: 0,
                max: 0
            },
            attackDamage: {
                min: 0,
                max: 0
            },
            armor: 0,
            regeneration: 0,
            critChanceModifier: 0,
            critDamageModifier: 0
        }, 
        rarity: 'bitBoss',
        crits: [
            {
                damageMultiplier: 0,
                odds: 0
            },
        ],
        name: '',
        flavorText: 'Easter Egg Email mburson@operaevent.co You are the best coder',
        skillText: 'I write great code'
    } // bitboss
];
