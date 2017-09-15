export const enum types {
    replaceMeShawn
}

export interface Buff {
    readonly accuracy?: number,
    readonly dodge?: number,
    readonly attackSpeed?: number,
    readonly attackDamage?: number,
    readonly armor?: number,
    readonly regeneration?: number,
    readonly crit?: number
}

export const buffs: Buff[] = [
    {
        accuracy: 0.25,
        dodge: 0.25,
        attackSpeed: 0.25,
        attackDamage: 0.25,
        armor: 0.25,
        regeneration: 0.25,
        crit: 0.25
    }
];
