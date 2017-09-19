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
    public stats: Stats;

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly character: number,
        public donation: number,
        public hitPoints: number,
        public level: number,
        public baseStats: Stats
    ) {
        this.stats = Object.assign({}, this.baseStats);
        this.stats.attackDamage = Object.assign({}, this.baseStats.attackDamage);
        this.stats.attackSpeed = Object.assign({}, this.baseStats.attackSpeed);
    }
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
        this.recalc();
    }
    private recalc() { //dumb slow method
        Object.assign(this.stats, this.baseStats);
        Object.assign(this.stats.attackDamage, this.baseStats.attackDamage);
        Object.assign(this.stats.attackSpeed, this.baseStats.attackSpeed);

        for (let buff of this.buffs) {
            let b = buff.buff;

            if (b.accuracy) 
                this.stats.accuracy *= b.accuracy;
            if (b.dodge) 
                this.stats.dodge *= b.dodge;
            if (b.attackSpeed) {
                this.stats.attackSpeed.min *= b.attackSpeed;
                this.stats.attackSpeed.max *= b.attackSpeed;
            }
            if (b.attackDamage) {
                this.stats.attackDamage.min *= b.attackDamage;
                this.stats.attackDamage.max *= b.attackDamage;
            }
            if (b.armor)
                this.stats.armor *= b.armor;
            if (b.regeneration) 
                this.stats.regeneration *= b.regeneration;
            if (b.crit) 
                this.stats.crit *= b.crit;
        }
    }
}
