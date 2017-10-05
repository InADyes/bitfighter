import { SSL_OP_COOKIE_EXCHANGE } from 'constants';
import { Damage, Dodge } from './fightEvents';
import { Health } from './graphicsEvents';
import { Message } from './frontEndMessage';
/*
    Each buff is multiplied agaisnt a stat to create a new that is then used.
    See Combatant for implementation.
*/
export interface Buff {
    readonly duration: number, // milliseconds
    readonly art: number,
    readonly accuracy?: number,
    readonly dodge?: number,
    readonly attackSpeed?: number, // doesn't work very well right now
    readonly attackDamage?: number,
    readonly armor?: number,
    readonly regeneration?: number,
    readonly critChanceModifier?: number // does not do anything right now
    readonly critDamageModifier?: number // also doesn't do anything
}


export const enum types {
    sculleryMaid            = 0,
    barkeep                 = 1,
    medium                  = 2,
    minstrel                = 3,
    mage                    = 4,
    rogue                   = 5,
    warpriest               = 6,
    warlockBuff             = 7,
    warlockDebuff           = 8,
    swashbucklerBuff        = 9,
    dragon                  = 10,
    armorBonus              = 11,
}
/*
export const enum types {
    streetUrchin        = 0,
    sculleryMaid        = 1,
    sculleryMaid1       = 2,
    farmer              = 3,
    barkeep             = 4,
    aristocrat          = 5,
    minstrel            = 6,
    mage                = 7,
    rogue               = 8,
    gladiator           = 9,
    barbarian           = 10,
    warpriest           = 11,
    werewolfBuff        = 12,
    warlockBuff         = 13,
    warlockDebuff       = 14,
    paladin             = 15,
    swashbucklerBuff    = 16,
//    swashbucklerDebuff  = 17,
    dragon              = 18,
    angel               = 19,
    phoenix             = 20,
    phoenix1            = 21,
    lichBuff            = 22,
    lichDebuff          = 23,
    armorBonus          = 24
}*/
/*
Scullery Maid   -   Mop Up          -   debuff: Accuracy -50% Dodge -50%
Barkeep         -   Last Call       -   debuff: Accuracy -80%
Medium          -   TBD             -   buff: Damage x2
Minstrel        -   Blinding Chord  -   debuff: Accuracy -100%
Mage            -   Magic Missile   -   Debuff: Armor -100%
Rogue           -   Backstab        -   buff: Crit Damage x4
Warpriest       -   Curse           -   buff:x2 armor, 400 regen
Warlock         -   Damnation       -   Debuff: accuracy -75%, dodge -75%
Warlock cont.   -   Damnation       -   buff: accuracy +100%, dodge +100%, crit damage x4, regen 500
Swashbuckler    -   Whirling Blades -   buff: dodge +25%, accuracy +25%
Dragon          -   Fire Breathing  -   Debuff: dodge - 100%
*/

export const buffs: Buff[] = [
    {
        duration: 6000,
        art: 0,
        accuracy: .5,
        dodge:.5
    },// Scullery Maid - Mop Up
    {
        duration: 6000,
        art: 1,
        accuracy: 0.2,
    },// Barkeep - Last Call
    {
        duration: 6000,
        art: 2,
        attackSpeed: 1.2
    },// Medium - TBD
    {
        duration: 3000,
        art: 3,
        accuracy: 0,
    },// Minstrel - Blinding Chord
    {
        duration: 6000,
        art: 4,
        armor: 0,
    },// Mage - Magic Missile
    {
        duration: 6000,
        art: 5,
        attackSpeed: .6,
    },// Rogue - Backstab
    {
        duration: 6000,
        art: 6,
        regeneration: 400,
        armor: 2,
    },// Warpriest - Curse
    {
        duration: 6000,
        art: 7,
        regeneration: 500,
        accuracy: 2,
        dodge: 2,
        critDamageModifier: 4,
    },// Warlock buff - Damnation
    {
        duration: 6000,
        art: 8,
        accuracy: .25,
        dodge: .25,
    },// Warlock Debuff - Damnation
    {
        duration: 6000,
        art: 9,
        dodge: 1.10,
        accuracy: 1.10
    },// Swashbuckler Buff - Whirling Blades
    {
        duration: 6000,
        art: 10,
        dodge: 0,
    },// Dragon - Fire Breathing
    {
        duration: 10000000,
        art: 22,
        armor: 1.5
    },// ArmorBonus
];

/*
export const buffs: Buff[] = [
    {
        duration: 6000,
        art: 0,
        critChanceModifier: 3,
    },// Street Urchin
    {
        duration: 6000,
        art: 1,
        accuracy: .5,
    },// Scullery Maid
    {
        duration: 6000,
        art: 1,
        dodge: .5,
    },// Scullery Maid 1
    {
        duration: 6000,
        art: 2,
        armor: 0.25,
    },// Farmer
    {
        duration: 6000,
        art: 3,
        accuracy: 0.2,
    },// Barkeep
    {
        duration: 6000,
        art: 4,
        critDamageModifier: 2,
    },// Aristocrat
    {
        duration: 3000,
        art: 5,
        accuracy: 0,
    },// Minstrel
    {
        duration: 6000,
        art: 6,
        armor: 0,
    },// Mage
    {
        duration: 6000,
        art: 7,
        critDamageModifier: 4,
    },// Rogue
    {
        duration: 6000,
        art: 8,
        dodge: 1.5,
        armor: 1.5,
    },// Gladiator
    {
        duration: 6000,
        art: 9,
        attackDamage: 2,
    },// Barbarian
    {
        duration: 6000,
        art: 10,
        regeneration: 400,
        armor: 2,
    },// Warpriest
    {
        duration: 6000,
        art: 11,
        attackSpeed: .5,
        attackDamage: 1.3,
    },// Werewolf Buff
    {
        duration: 6000,
        art: 12,
        regeneration: 500,
        accuracy: 2,
        dodge: 2,
        critDamageModifier: 4,
    },// Warlock buff
    {
        duration: 6000,
        art: 13,
        accuracy: .25,
        dodge: .25,
    },// Warlock Debuff
    {
        duration: 6000,
        art: 14,
        dodge: 1.7,
        armor: 1.9,
    },// Paladin
    {
        duration: 6000,
        art: 15,
        dodge: 1.10,
        accuracy: 1.10
    },// Swashbuckler Buff
    {
        duration: 10000,        // NOT IN USE
        art: 16,                // NOT IN USE
        armor: 0.7,             // NOT IN USE
    },// Swashbuckler Debuff       NOT IN USE
    {
        duration: 6000,
        art: 17,
        dodge: 0,
    },// Dragon
    {
        duration: 6000,
        art: 18,
        regeneration: 400,
    },// Angel
    {
        duration: 6000,
        art: 19,
        regeneration: 2000,
    },// Phoenix
    {
        duration: 6000,
        art: 20,
        armor: 0,
    },// Phoenix1
    {
        duration: 6000,
        art: 21,
        dodge: 2,
        critDamageModifier: 2,
    },// LichBuff
    {
        duration: 6000,
        art: 21,
        accuracy: .25,
    },// LichDebuff
    {
        duration: 10000000,
        art: 22,
        armor: 1.5
    },// ArmorBonus
];
*/