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
    id: number,
    name: string,
    donation: number,
    hitPoints: number,
    character: number,
    stats: Stats,
    level: number
}
