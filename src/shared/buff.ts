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
    // speedCritBuff       = 0,
    // dodgeCritdeBuff     = 1,
    // accuracyCritDebuff  = 2,
    // armorCritDebuff     = 3,
    // accuracyCritBuff    = 4,
    // speedCritDebuff     = 5,
    // damageCritDebuff    = 6,

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
    werewolfDebuff      = 13,
    warlockDebuff       = 14,
    paladin             = 15,
    swashbucklerBuff    = 16,
    swashbucklerDebuff  = 17,
    dragon              = 18
}

export const buffs: Buff[] = [
    {
        duration: 10000,
        art: 0,
        critChanceModifier: 3,
    },// Street Urchin
    {
        duration: 10000,
        art: 1,
        accuracy: .5,
    },// Scullery Maid
    {
        duration: 10000,
        art: 1,
        dodge: .5,
    },// Scullery Maid 1
    {
        duration: 10000,
        art: 2,
        armor: 0.25,
    },// Farmer
    {
        duration: 10000,
        art: 3,
        accuracy: 0.2,
    },// Barkeep
    {
        duration: 10000,
        art: 4,
        attackDamage: 2,
    },// Aristocrat
    {
        duration: 10000,
        art: 5,
        accuracy: 0,
    },// Minstrel
    // {
    //     duration: 15000,
    //     art: 6,
    //     armor: 0,
    // },// Mage
    // {
    //     duration: 15000,
    //     art: 7,
    //     dodge: 1.5,
    // },// Rogue
    // {
    //     duration: 15000,
    //     art: 8,
    //     attackDamage: 0.5,
    //     armor: .25,
    // },// Gladiator
    // {
    //     duration: 15000,
    //     art: 9,
    //     attackDamage: 8,
    // },// Barbarian
    // {
    //     duration: 15000,
    //     art: 10,
    //     accuracy: 0.25,
    //     dodge: 0.25,
    //     attackDamage: 0.25,
    //     critChanceModifier: .5,
    // },// Warpriest
    // {
    //     duration: 15000,
    //     art: 11,
    //     attackSpeed: 4,
    // },// Werewolf Buff
    // {
    //     duration: 15000,
    //     art: 12,
    //     dodge: 0.4,
    // },// Werewolf Debuff
    // {
    //     duration: 15000,
    //     art: 13,
    //     dodge: 0,
    //     attackDamage: 0.5,
    //     armor: 0,
    // },// Warlock Debuff
    // {
    //     duration: 15000,
    //     art: 14,
    //     armor: 6,
    // },// Paladin
    // {
    //     duration: 15000,
    //     art: 15,
    //     attackSpeed: 2,
    //     accuracy: 1.25,
    //     critChanceModifier: 2,
    // },// Swashbuckler Buff
    // {
    //     duration: 15000,
    //     art: 16,
    //     armor: 0.7,
    // },// Swashbuckler Debuff
    // {
    //     duration: 15000,
    //     art: 17,
    // },// Dragon
    // {
    //     duration: 3000,
    //     art: 0,
    //     accuracy: 0.25,
    //     dodge: 0.25,
    //     attackSpeed: 0.25,
    //     attackDamage: 0.25,
    //     armor: 0.25,
    //     regeneration: 0.25,
    //     crit: 0.25
    // },
    // {
    //     duration: 3000,
    //     art: 0,
    //     accuracy: 0.25,
    //     dodge: 0.25,
    //     attackSpeed: 0.25,
    //     attackDamage: 0.25,
    //     armor: 0.25,
    //     regeneration: 0.25,
    //     crit: 0.25
    // },
    // {
    //     duration: 3000,
    //     art: 0,
    //     accuracy: 0.25,
    //     dodge: 0.25,
    //     attackSpeed: 0.25,
    //     attackDamage: 0.25,
    //     armor: 0.25,
    //     regeneration: 0.25,
    //     crit: 0.25
    //}
];
