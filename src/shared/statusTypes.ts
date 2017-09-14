export interface Stats {
    readonly maxHitPoints: number;
    readonly accuracy: number;
    readonly dodge: number;
    readonly attackSpeed: {
        min: number;
        max: number;
    }; // in milliseconds
    readonly attackDamage: {
        min: number;
        max: number;
    };
    readonly armor: number;
    readonly regeneration: number;
    readonly crit: number;
}

export interface Status {
    readonly id: number,
    readonly name: string,
    readonly character: number,
    donation: number,
    hitPoints: number,
    stats: Stats,
    level: number
}
