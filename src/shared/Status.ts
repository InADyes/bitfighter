import * as Buff from './buff';

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

export class Status {
    private buffs: {
        expires: number,
        buff: Buff.Buff
    }[] = [];

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly character: number,
        public donation: number,
        public hitPoints: number,
        public level: number,
        public baseStats: Stats
    ) {}
    addEffect(expires: number, buff: Buff.Buff) {
        this.buffs.push({expires: expires, buff: buff});
    }
    checkBuffs(time: number) {
        this.buffs = this.buffs.filter(buff => {
            buff.expires > time;
        });
    }
    clearBuffs() {
        this.buffs = [];
    }
    get stats() { //dumb slow method
        let stats = Object.assign({}, this.baseStats);

        for (let buff of this.buffs) {
            let b = buff.buff;

            if (b.accuracy) 
                stats.accuracy *= b.accuracy;
            if (b.dodge) 
                stats.dodge *= b.dodge;
            if (b.attackSpeed) {
                stats.attackSpeed.min *= b.attackSpeed;
                stats.attackSpeed.max *= b.attackSpeed;
            }
            if (b.attackDamage) {
                stats.attackDamage.min *= b.attackDamage;
                stats.attackDamage.max *= b.attackDamage;
            }
            if (b.armor)
                stats.armor *= b.armor;
            if (b.regeneration) 
                stats.regeneration *= b.regeneration;
            if (b.crit) 
                stats.crit *= b.crit;
        }
        return stats;
    }
    set stats(stats: Stats) {
        this.baseStats = stats;
    }
}
