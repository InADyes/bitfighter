export interface Stats {
    readonly maxHitPoints: number;
    readonly accuracy: number;
    readonly dodge: number;
    readonly attackSpeed: number;
    readonly attackDamage: number;
    readonly armor: number;
    readonly regeneration: number;
}

export interface Status {
    id: number,
    name: string,
    donation: number,
    hitPoints: number,
    art: number,
    stats: Stats
}
