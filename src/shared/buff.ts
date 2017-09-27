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
    swashbucklerDebuff  = 17,
    dragon              = 18,
    angel               = 19,
    phoenix             = 20,
    phoenix1            = 21,
    lichBuff            = 22,
    lichDebuff          = 23,
    armorBonus          = 24
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
    {
        duration: 10000,
        art: 6,
        armor: 0,
    },// Mage
    {
        duration: 10000,
        art: 7,
        critDamageModifier: 4,
    },// Rogue
    {
        duration: 10000,
        art: 8,
        dodge: 1.5,
        armor: 1.5,
    },// Gladiator
    {
        duration: 10000,
        art: 9,
        attackDamage: 2,
    },// Barbarian
    {
        duration: 10000,
        art: 10,
        regeneration: 400,
        armor: 2,
    },// Warpriest
    {
        duration: 10000,
        art: 11,
        attackSpeed: .5,
        attackDamage: 1.3,
    },// Werewolf Buff
    {
        duration: 10000,
        art: 12,
        regeneration: 500,
        accuracy: 2,
        dodge: 2,
        critDamageModifier: 4,
    },// Warlock buff
    {
        duration: 10000,
        art: 13,
        accuracy: .25,
        dodge: .25,
    },// Warlock Debuff
    {
        duration: 10000,
        art: 14,
        dodge: 1.7,
        armor: 1.9,
    },// Paladin
    {
        duration: 10000,
        art: 15,
        attackSpeed: .3,
        attackDamage: 1.25,
        accuracy: 2,
    },// Swashbuckler Buff
    {
        duration: 10000,        // NOT IN USE
        art: 16,                // NOT IN USE
        armor: 0.7,             // NOT IN USE
    },// Swashbuckler Debuff       NOT IN USE
    {
        duration: 10000,
        art: 17,
        dodge: 0,
    },// Dragon
    {
        duration: 10000,
        art: 18,
        regeneration: 400,
    },// Angel
    {
        duration: 10000,
        art: 19,
        regeneration: 2000,
    },// Phoenix
    {
        duration: 10000,
        art: 20,
        armor: 0,
    },// Phoenix1
    {
        duration: 10000,
        art: 21,
        dodge: 2,
        critDamageModifier: 2,
    },// LichBuff
    {
        duration: 10000,
        art: 21,
        accuracy: .25,
    },// LichDebuff
    {
        duration: 10000000,
        art: 22,
        armor: 1.5
    },// ArmorBonus
];
