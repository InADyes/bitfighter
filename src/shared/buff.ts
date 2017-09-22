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
    readonly critChance?: number // does not do anything right now
    readonly critMultiplier?: number // also doesn't do anything
}

export const enum types {
    streetUrchin        = 0,
    sculleryMaid        = 1,
    farmer              = 2,
    barkeep             = 3,
    aristocrat          = 4,
    minstrel            = 5,
    mage                = 6,
    rogue               = 7,
    gladiator           = 8,
    barbarian           = 9,
    warpriest           = 10,
    werewolfBuff        = 11,
    werewolfDebuff      = 12,
    warlockDebuff       = 13,
    paladin             = 14,
    swashbucklerBuff    = 15,
    swashbucklerDebuff  = 16,
    dragon              = 17
}

export const buffs: Buff[] = [
    {
        duration: 15000,
        art: 0,
        dodge: 3,
    },// Street Urchin
    {
        duration: 15000,
        art: 1,
        accuracy: .25,
        dodge: .25,
    },// Scullery Maid
    {
        duration: 15000,
        art: 2,
        armor: 0.25,
    },// Farmer
    {
        duration: 15000,
        art: 3,
        accuracy: 0.2,
    },// Barkeep
    {
        duration: 15000,
        art: 4,
        dodge: 0.2,
        armor: 0.5,
    },// Aristocrat
    {
        duration: 15000,
        art: 5,
        accuracy: 0,
    },// Minstrel
    {
        duration: 15000,
        art: 6,
        armor: 0,
    },// Mage
    {
        duration: 15000,
        art: 7,
        dodge: 1.5,
    },// Rogue
    {
        duration: 15000,
        art: 8,
        attackDamage: 0.5,
        armor: .25,
    },// Gladiator
    {
        duration: 15000,
        art: 9,
        attackDamage: 8,
    },// Barbarian
    {
        duration: 15000,
        art: 10,
        accuracy: 0.25,
        dodge: 0.25,
        attackDamage: 0.25,
        critChance: .5,
    },// Warpriest
    {
        duration: 15000,
        art: 11,
        attackSpeed: 4,
    },// Werewolf Buff
    {
        duration: 15000,
        art: 12,
        dodge: 0.4,
    },// Werewolf Debuff
    {
        duration: 15000,
        art: 13,
        dodge: 0,
        attackDamage: 0.5,
        armor: 0,
    },// Warlock Debuff
    {
        duration: 15000,
        art: 14,
        armor: 6,
    },// Paladin
    {
        duration: 15000,
        art: 15,
        attackSpeed: 2,
        accuracy: 1.25,
        critChance: 2,
    },// Swashbuckler Buff
    {
        duration: 15000,
        art: 16,
        armor: 0.7,
    },// Swashbuckler Debuff
    {
        duration: 15000,
        art: 17,
    },// Dragon
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
