import { Buff } from './interfaces/buff';
import { CharacterCard } from './interfaces/backToFrontMessage';
import { Character, Item, Stats } from './interfaces/interfaces';

export class Combatant {
    private buffs: {
        expires: number,
        buff: Buff
    }[] = [];
    private calculatedStats: Stats;
    private bossMessageChangesRemaining = 3;
    public time = 0;

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly character: Character,
        public readonly initialDonation: number,
        public hitPoints: number,
        public level: number,
        public baseStats: Stats,
        private p_bossMessage: string,
        public readonly profileImageURL: string,
        public bossEmoticonURL: string,
        public readonly className: string,
        private readonly items: Item[]
    ) {
        this.calculatedStats = Object.assign({}, this.baseStats);
        this.calculatedStats.attackDamage = Object.assign({}, this.baseStats.attackDamage);
        this.calculatedStats.attackSpeed = Object.assign({}, this.baseStats.attackSpeed);
    }
    addEffect(expires: number, buff: Buff) {
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

        for (let item of this.items)
            this.applyBuffs(...item.buffs);
        for (let buff of this.buffs)
            this.applyBuffs(buff.buff);
    }
    private applyBuffs(...buffs: Buff[]) {
        for (let b of buffs) {
            if (b.accuracy) 
                this.calculatedStats.accuracy *= b.accuracy;
            if (b.dodge) 
                this.calculatedStats.dodge *= b.dodge;
            if (b.attackSpeed) {
                this.calculatedStats.attackSpeed.min *= b.attackSpeed.min;
                this.calculatedStats.attackSpeed.max *= b.attackSpeed.max;
            }
            if (b.attackDamage) {
                this.calculatedStats.attackDamage.min *= b.attackDamage.min;
                this.calculatedStats.attackDamage.max *= b.attackDamage.max;
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
    // does not clone name change counter
    public clone() {
        return Combatant.clone(this);
    }
    // TODO: only recalculate the level and bonus health
    get card(): CharacterCard {
        const character = this.character;
        const crit = character.crits.find(c => (c.buff || c.debuff) !== undefined)

        const buff = crit ? (crit.buff || crit.debuff) : undefined;

        return {
            stats: this.character.cardStats,
            baseHealth: this.stats.maxHitPoints,
            bonusHealth: this.stats.maxHitPoints - this.character.stats.maxHitPoints,
            className: this.className,
            art: this.character.artPath,
            level: this.level,
            rarity: this.character.rarity,
            flavorText: this.character.flavorText,
            skillText: this.character.skillText,
            bitBossCheerMote: false,
            selectable: true,
            buffArt: buff ? buff.artPath : 'ERROR: NO BUFF FOUND',
            buffName: buff ? buff.name : 'ERROR: NO BUFF FOUND'
        };
    }
    get bossMessage() {return this.p_bossMessage;};
    setBossMessage(bossMessage: string): boolean {
        if (this.bossMessageChangesRemaining < 1)
            return false;
        this.bossMessageChangesRemaining--;
        this.p_bossMessage = bossMessage;
        return true;
    }

    public static clone(o: Combatant): Combatant {
        
        const s = new Combatant(
            o.id, //getto deep clone
            o.name,
            o.character,
            o.initialDonation,
            o.hitPoints,
            o.level,
            o.baseStats,
            o.p_bossMessage,
            o.profileImageURL,
            o.bossEmoticonURL,
            o.className,
            o.items
        );
        s.bossMessageChangesRemaining = o.bossMessageChangesRemaining;
        return s;
    }

    public useItem(i: Item) {
        if (i.duration) {
            i.buffs.forEach(b => this.buffs.push({ // todo: fix (this wont work real well if they aren't aready in a fight)
                expires: this.time + b.duration,
                buff: b
            }));
        } else {
            this.items.push(i);
        }
        this.recalc();
    }
}
