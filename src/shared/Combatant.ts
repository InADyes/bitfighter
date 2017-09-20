import * as fightEvents from './fightEvents';
import * as Buff from './buff';
import * as characterPicker from './characterPicker';
import { Status } from '../shared/Status';


interface attackProps {
    attacker: Combatant,
    damage: number,
    accuracy: number,
    critChance: number,
    critMultiplier: number,
    critDebuff?: Buff.Buff,
    critBuff?: Buff.Buff
}

export class Combatant {
    public time: number = 0;

    constructor(
        public readonly status: Status,
        public readonly index: number,
        private readonly newEvent: (event: fightEvents.Event) => void,
        private readonly attackCallback: (attack: attackProps) => void
    ) {
        this.rollAttackSpeed();
    }
    // increase internal timer by attack speed;
    private rollAttackSpeed() {
        this.time += Math.ceil(Math.random() * (this.status.stats.attackSpeed.max - this.status.stats.attackSpeed.min)) + this.status.stats.attackSpeed.min;
    }

    public attack() {
        this.status.checkBuffs(this.time);

        const stats = this.status.stats;
    
        this.rollAttackSpeed();

        const damageRoll = Math.ceil(Math.random() * (stats.attackDamage.max - stats.attackDamage.min)) + stats.attackDamage.min;

        // this.attackCallback(this, damageRoll, stats.accuracy, stats.critChance, stats.critMultiplier, characterPicker.characters[this.status.character].critDebuff, characterPicker.characters[this.status.character].critBuff
        // );
        this.attackCallback({
            attacker: this,
            damage: damageRoll,
            accuracy: stats.accuracy,
            critChance: stats.critChance,
            critMultiplier: stats.critMultiplier,
            critDebuff: characterPicker.characters[this.status.character].critDebuff,
            critBuff: characterPicker.characters[this.status.character].critBuff
        });
    }
    // public takeHit(damage: number, accuracy: number, critChance: number, critDebuff?: Buff.Buff, critBuff?: Buff.Buff) {
    //     this.status.checkBuffs(this.time);
    public takeHit(attack: attackProps) {
    
        const total = attack.accuracy + this.status.stats.dodge;
        const hitChangeRoll = Math.ceil(Math.random() * total);
    
        if (hitChangeRoll > attack.accuracy) {
            this.newEvent(new fightEvents.Dodge(this.time, this.index));
            return;
        }

        if (Math.ceil(Math.random() * 100) >= attack.critChance) {
            attack.damage = attack.damage * attack.critMultiplier - this.status.stats.armor;
            this.newEvent(new fightEvents.Crit(this.time, this.index, attack.critDebuff, attack.critBuff));
        } else
            attack.damage -= this.status.stats.armor; //applied here so that armor is calculated before the buff is applied when there is a crit

        if (attack.damage < 0)
            attack.damage = 0;
        else if (attack.damage > this.status.hitPoints)
            attack.damage = this.status.stats.maxHitPoints;
        this.newEvent(new fightEvents.Damage(this.time, this.index, attack.damage));
            
        if (this.status.hitPoints <= 0)
            this.newEvent(new fightEvents.Death(this.time, this.index));
    }
    public heal() {
        this.status.checkBuffs(this.time);
        const maxHitPoints = this.status.stats.maxHitPoints;

        let healingAmount = this.status.stats.regeneration * maxHitPoints;

        if (healingAmount + this.status.hitPoints > maxHitPoints)
            healingAmount = maxHitPoints - this.status.hitPoints;

        this.newEvent(new fightEvents.Healing(this.time, this.index, healingAmount));
    }
}
