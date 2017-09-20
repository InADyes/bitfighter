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
    readonly critChance?: number
    readonly critMultiplier?: 1
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
        duration: 10000,
        art: 0,
        dodge: 2,
    },// Street Urchin
    {
        duration: 10000,
        art: 0,
        accuracy: 0.5,
        dodge: 0.5,
    },// Scullery Maid
    {
        duration: 10000,
        art: 0,
        armor: 0.5,
    },// Farmer
    {
        duration: 10000,
        art: 0,
        accuracy: 0.2,
    },// Barkeep
    {
        duration: 10000,
        art: 0,
        dodge: 0.2,
        armor: 0.75,
    },// Aristocrat
    {
        duration: 10000,
        art: 0,
        accuracy: 0,
    },// Minstrel
    {
        duration: 10000,
        art: 0,
        armor: 0,
    },// Mage
    {
        duration: 10000,
        art: 0,
        dodge: 1.5,
    },// Rogue
    {
        duration: 10000,
        art: 0,
        attackDamage: 0.75,
        armor: .5,
    },// Gladiator
    {
        duration: 10000,
        art: 0,
        attackDamage: 4,
    },// Barbarian
    {
        duration: 15000,
        art: 0,
        accuracy: 0.75,
        dodge: 0.75,
        attackDamage: 0.75,
        critChance: .5,
    },// Warpriest
    {
        duration: 10000,
        art: 0,
        attackSpeed: 2,
    },// Werewolf Buff
    {
        duration: 10000,
        art: 0,
        dodge: 0.7,
    },// Werewolf Debuff
    {
        duration: 10000,
        art: 0,
        dodge: 0,
        attackDamage: 0.5,
        armor: 0,
    },// Warlock Debuff
    {
        duration: 5000,
        art: 0,
        armor: 3,
    },// Paladin
    {
        duration: 10000,
        art: 0,
        attackSpeed: 1.25,
        armor: 0.7,
        critChance: 2,
    },// Swashbuckler Buff
    {
        duration: 10000,
        art: 0,
        attackSpeed: 1.25,
        armor: 0.7,
        critChance: 2,
    },// Swashbuckler Debuff
    {
        duration: 10000,
        art: 0,
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
