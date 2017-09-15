export interface Stats {
    maxHitPoints: number;
    accuracy: number;
    dodge: number;
    attackSpeed: {
        min: number;
        max: number;
    }; // in milliseconds
    attackDamage: {
        min: number;
        max: number;
    };
    armor: number;
    regeneration: number;
    crit: number;
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
