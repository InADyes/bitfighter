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
    critChanceModifier: number;
    critDamageModifier: number;
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
        public baseStats: Stats,
        public readonly profileImageURL: string,
        public readonly chatMessage: string
    ) {
        this.calculatedStats = Object.assign({}, this.baseStats);
        this.calculatedStats.attackDamage = Object.assign({}, this.baseStats.attackDamage);
        this.calculatedStats.attackSpeed = Object.assign({}, this.baseStats.attackSpeed);
    }
    addEffect(expires: number, buff: Buff.Buff) {
        this.buffs.push({expires: expires, buff: buff});
        this.recalc();
    }
    checkBuffs(time: number) {
        let change = false;
        this.buffs = this.buffs.filter(buff => {
            buff.expires > time;
            change = true;
        });
        if (change)
            this.recalc();
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
            if (b.critChanceModifier) 
                this.calculatedStats.critChanceModifier *= b.critChanceModifier;
            if (b.critDamageModifier) 
                this.calculatedStats.critDamageModifier *= b.critDamageModifier;
        }
    }
    public get stats() {
        return this.calculatedStats;
    }
    public clone() {
        return new Status(
            this.id, //getto deep clone
            this.name,
            this.character,
            this.initialDonation,
            this.hitPoints,
            this.level,
            this.baseStats,
            this.profileImageURL,
            this.chatMessage
        );
    }
}
