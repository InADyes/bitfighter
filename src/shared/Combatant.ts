import * as Buff from './interfaces/buff';
import { CharacterCard } from './interfaces/backToFrontMessage';
import { characterTypes, characters, buffURLs } from './characterPicker';

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

export type choiceStats = {[details: string]: number};

export const cardStats: {[details: number]: choiceStats} = {
    [characterTypes.sculleryMaid]: {
        accuracy: 6,
        dodge: 6,
        armor: 5,
        damage: 5,
        speed: 5,
    },
    [characterTypes.barkeep]: {
        accuracy: 3,
        dodge: 4,
        armor: 8,
        damage: 6,
        speed: 3
    },
    [characterTypes.medium]: {
        accuracy: 5,
        dodge: 6,
        armor: 1,
        damage: 3,
        speed: 7
    },
    [characterTypes.minstrel]: {
        accuracy: 5,
        dodge: 6,
        armor: 2,
        damage: 5,
        speed: 8
    },
    [characterTypes.mage]: {
        accuracy: 10,
        dodge: 4,
        armor: 5,
        damage: 2,
        speed: 10
    },
    [characterTypes.rogue]: {
        accuracy: 8,
        dodge: 8,
        armor: 3,
        damage: 1,
        speed: 9
    },
    [characterTypes.warpriest]: {
        accuracy: 3,
        dodge: 3,
        armor: 10,
        damage: 3,
        speed: 4
    },
    [characterTypes.warlock]: {
        accuracy: 2,
        dodge: 2,
        armor: 5,
        damage: 9,
        speed: 2
    },
    [characterTypes.swashbuckler]: {
        accuracy: 7,
        dodge: 8,
        armor: 3,
        damage: 6,
        speed: 6
    },
    [characterTypes.dragon]: {
        accuracy: 1,
        dodge: 1,
        armor: 8,
        damage: 10,
        speed: 1
    },
    [characterTypes.graveDigger]: {
        accuracy: 3,
        dodge: 2,
        armor: 8,
        damage: 4,
        speed: 4
    },
    [characterTypes.bitBoss]: {
        accuracy: 0,
        dodge: 0,
        armor: 0,
        damage: 0,
        speed: 0
    }
}

export class Combatant {
    private buffs: {
        expires: number,
        buff: Buff.Buff
    }[] = [];
    private calculatedStats: Stats;
    private bossMessageChangesRemaining = 3;
    public time = 0;

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly character: number,
        public readonly initialDonation: number,
        public hitPoints: number,
        public level: number,
        public baseStats: Stats,
        private p_bossMessage: string,
        public readonly profileImageURL: string,
        public bossEmoticonURL: string,
        public readonly className: string
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
    // does not clone name change counter
    public clone() {
        return Combatant.clone(this);
    }
    // TODO: only recalculate the level and bonus health
    get card(): CharacterCard {
        const character = characters[this.character];
        const crit = character.crits.find(c => (c.buff || c.debuff) !== undefined)

        const buff = crit ? (crit.buff || crit.debuff) : undefined;

        return {
            stats: cardStats[this.character] || cardStats[-1],
            baseHealth: this.stats.maxHitPoints,
            bonusHealth: this.stats.maxHitPoints - characters[this.character].stats.maxHitPoints,
            className: this.className,
            art: this.character,
            level: this.level,
            rarity: characters[this.character].rarity,
            flavorText: characters[this.character].flavorText,
            skillText: characters[this.character].skillText,
            bitBossCheerMote: false,
            selectable: true,
            buffArt: buff ? buffURLs[buff.art] : 'ERROR: NO BUFF FOUND',
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
            o.className
        );
        s.bossMessageChangesRemaining = o.bossMessageChangesRemaining;
        return s;
    }
}
