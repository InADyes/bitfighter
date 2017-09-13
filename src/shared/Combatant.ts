export interface Stats {
    maxHitPoints: number;
    accuracy: number;
    dodge: number;
    attackSpeed: number;
    attackDamage: number;
    armor: number;
    regeneration: number;
}

export interface Status {
    id: number,
    name: string,
    donation: number,
    hitPoints: number,
    art: number,
    stats: Stats
}
