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
    readonly crit?: number
}

export const enum types {
    replaceMeShawn = 0
}

export const buffs: Buff[] = [
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
    
];
