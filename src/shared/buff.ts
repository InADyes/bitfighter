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
}

export const enum types {
    replaceMeShawn = 0
}

export const buffs: Buff[] = [
    {
        duration: 10000,
        art: 0,
        dodge: 2,
        crit: 7
    },// Street Urchin
    {
        duration: 10000,
        art: 0,
        accuracy: 0.5,
        dodge: 0.5,
        crit: 3
    },// Scullery Maid
    {
        duration: 10000,
        art: 0,
        armor: 0.5,
        crit: 3
    },// Farmer
    {
        duration: 10000,
        art: 0,
        accuracy: 0.2,
        crit: 2
    },// Barkeep
    {
        duration: 10000,
        art: 0,
        dodge: 0.2,
        armor: 0.75,
        crit: 2
    },// Aristocrat
    {
        duration: 10000,
        art: 0,
        accuracy: 0,
        crit: 2
    },// Minstrel
    {
        duration: 10000,
        art: 0,
        armor: 0,
        crit: 1.5
    },// Mage
    {
        duration: 10000,
        art: 0,
        dodge: 1.5,
        crit: 10
    },// Rogue
    {
        duration: 3000,
        art: 0,
        attackSpeed: 0.25,
        attackDamage: 0.75,
        armor: .5,
        crit: 3
    },// Gladiator
    {
        duration: 3000,
        art: 0,
        accuracy: 0.25,
        dodge: 0.25,
        attackSpeed: 0.25,
        attackDamage: 0.25,
        armor: 0.25,
        regeneration: 0.25,
        crit: 0.25
    },// Barbarian
    {
        duration: 3000,
        art: 0,
        accuracy: 0.25,
        dodge: 0.25,
        attackSpeed: 0.25,
        attackDamage: 0.25,
        armor: 0.25,
        regeneration: 0.25,
        crit: 0.25
    },// Warpriest
    {
        duration: 3000,
        art: 0,
        accuracy: 0.25,
        dodge: 0.25,
        attackSpeed: 0.25,
        attackDamage: 0.25,
        armor: 0.25,
        regeneration: 0.25,
        crit: 0.25
    },// Werewolf
    {
        duration: 3000,
        art: 0,
        accuracy: 0.25,
        dodge: 0.25,
        attackSpeed: 0.25,
        attackDamage: 0.25,
        armor: 0.25,
        regeneration: 0.25,
        crit: 0.25
    },// Warlock
    {
        duration: 3000,
        art: 0,
        accuracy: 0.25,
        dodge: 0.25,
        attackSpeed: 0.25,
        attackDamage: 0.25,
        armor: 0.25,
        regeneration: 0.25,
        crit: 0.25
    },// Paladin
    {
        duration: 3000,
        art: 0,
        accuracy: 0.25,
        dodge: 0.25,
        attackSpeed: 0.25,
        attackDamage: 0.25,
        armor: 0.25,
        regeneration: 0.25,
        crit: 0.25
    },// Swashbuckler
    {
        duration: 3000,
        art: 0,
        accuracy: 0.25,
        dodge: 0.25,
        attackSpeed: 0.25,
        attackDamage: 0.25,
        armor: 0.25,
        regeneration: 0.25,
        crit: 0.25
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
