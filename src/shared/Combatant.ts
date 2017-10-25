import { FightEvent } from './interfaces/fightEvents';
import * as Buff from './interfaces/buff';
import * as characterPicker from './characterPicker';
import { Status } from '../shared/Status';
import { Source } from '../shared/interfaces/interfaces';

interface attackProps {
    source: Source;
    time: number;
    attacker: Combatant;
    damage: number;
    accuracy: number;
    critChanceModifier: number;
    critDamageModifier: number;
    crits: {
        odds: number;
        debuff?: Buff.Buff;
        buff?: Buff.Buff;
        damageMultiplier?: number;
    }[];
}

export class Combatant {
    constructor(
        public readonly status: Status,
        private readonly newEvent: (event: FightEvent) => void,
        private readonly attackCallback: (attack: attackProps) => void,
        public time: number = 0
    ) {
        this.rollAttackSpeed();
    }
    // increase internal timer by attack speed;
    private rollAttackSpeed() {
        this.time += Math.ceil(Math.random() * (this.status.stats.attackSpeed.max - this.status.stats.attackSpeed.min)) + this.status.stats.attackSpeed.min;
    }

    public attack() {
        this.newEvent({
            type: 'attack',
            time: this.time,
            targetID: this.status.id
        });

        this.status.checkBuffs(this.time);

        const stats = this.status.stats;

        const damageRoll = Math.ceil(Math.random() * (stats.attackDamage.max - stats.attackDamage.min)) + stats.attackDamage.min;

        this.attackCallback({
            source: {
                type: 'combatant',
                status: this.status
            },
            time: this.time,
            attacker: this,
            damage: damageRoll,
            accuracy: stats.accuracy,
            critDamageModifier: stats.critDamageModifier,
            critChanceModifier: stats.critChanceModifier,
            crits: characterPicker.characters[this.status.character].crits
        });
        
        this.rollAttackSpeed();
    }
    public takeHit(attack: attackProps) {
    
        const total = attack.accuracy + this.status.stats.dodge;
        const hitChangeRoll = Math.ceil(Math.random() * total);
    
        if (hitChangeRoll > attack.accuracy) {
            this.newEvent({
                type: 'dodge',
                time: attack.time,
                targetID: this.status.id,
                source: attack.source
            });
            return;
        }

        attack.damage -= this.status.stats.armor // applied before crit multipliers

        for (let crit of attack.crits) {
            if (Math.ceil(Math.random() * 100) <= crit.odds * attack.critChanceModifier) {
                if (crit.damageMultiplier)
                    attack.damage = (attack.damage - this.status.stats.armor) * crit.damageMultiplier * attack.critDamageModifier;
                this.newEvent({
                    type: 'crit',
                    time: attack.time,
                    targetID: this.status.id,
                    damage: crit.damageMultiplier !== undefined,
                    buff: crit.buff,
                    debuff: crit.debuff,
                    source: attack.source
                });
            }
        }

        if (attack.damage < 0)
            attack.damage = 0;
        // else if (attack.damage > this.status.hitPoints)
        //     attack.damage = this.status.hitPoints;

        this.newEvent({
            type: 'damage',
            time: attack.time,
            targetID: this.status.id,
            amount: attack.damage,
            source: attack.source
        });
            
        if (this.status.hitPoints <= 0) {
            this.newEvent({
                type: 'death',
                time: attack.time,
                targetID: this.status.id,
                source: attack.source,
                overkill: -1 * this.status.hitPoints
            });
        }

    }
    public heal(source: Source) {
        this.status.checkBuffs(this.time);
        const maxHitPoints = this.status.stats.maxHitPoints;
        let healingAmount = this.status.stats.regeneration;

        if (healingAmount + this.status.hitPoints > maxHitPoints)
            healingAmount = maxHitPoints - this.status.hitPoints;

        // allways heals the first character in the future, needs to be changed
        this.newEvent({
            type: 'heal',
            time: this.time + 200,
            targetID: this.status.id,
            amount: healingAmount,
            source: source
        });
    }
}
