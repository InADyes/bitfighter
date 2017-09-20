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
    critChance: number;
    critMultiplier: number;
}

export class Status {
    private buffs: {
        expires: number,
        buff: Buff.Buff
    }[] = [];
    private calculatedStats: Stats;

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly character: number,
        public readonly initialDonation: number,
        public hitPoints: number,
        public level: number,
        public baseStats: Stats
    ) {
        this.calculatedStats = Object.assign({}, this.baseStats);
        this.calculatedStats.attackDamage = Object.assign({}, this.baseStats.attackDamage);
        this.calculatedStats.attackSpeed = Object.assign({}, this.baseStats.attackSpeed);
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
        Object.assign(this.calculatedStats, this.baseStats);
        Object.assign(this.calculatedStats.attackDamage, this.baseStats.attackDamage);
        Object.assign(this.calculatedStats.attackSpeed, this.baseStats.attackSpeed);

        for (let buff of this.buffs) {
            let b = buff.buff;

            if (b.accuracy) 
                this.calculatedStats.accuracy *= b.accuracy;
            if (b.dodge) 
                this.calculatedStats.dodge *= b.dodge;
            if (b.attackSpeed) {
                this.calculatedStats.attackSpeed.min *= b.attackSpeed;
                this.calculatedStats.attackSpeed.max *= b.attackSpeed;
            }
            if (b.attackDamage) {
                this.calculatedStats.attackDamage.min *= b.attackDamage;
                this.calculatedStats.attackDamage.max *= b.attackDamage;
            }
            if (b.armor)
                this.calculatedStats.armor *= b.armor;
            if (b.regeneration) 
                this.calculatedStats.regeneration *= b.regeneration;
            if (b.critChance) 
                this.calculatedStats.critChance *= b.critChance;
            if (b.critMultiplier) 
                this.calculatedStats.critMultiplier *= b.critMultiplier;
        }
    }
    public get stats() {
        return this.calculatedStats;
    }
}
