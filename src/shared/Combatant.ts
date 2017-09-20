import * as fightEvents from './fightEvents';
import * as Buff from './buff';
import * as characterPicker from './characterPicker';
import { Status } from '../shared/Status';

export class Combatant {
    public time: number = 0;

    constructor(
        public readonly status: Status,
        public readonly index: number,
        private readonly newEvent: (event: fightEvents.Event) => void,
        private readonly attackCallback: (combatant: Combatant, damage: number, accuracy: number, critChance: number, critDebuff?: Buff.Buff, critBuff?: Buff.Buff) => void
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

        this.attackCallback(this, damageRoll, stats.accuracy, stats.crit, characterPicker.characters[this.status.character].critDebuff, characterPicker.characters[this.status.character].critBuff
        );
    }
    public takeHit(damage: number, accuracy: number, critChance: number, critDebuff?: Buff.Buff, critBuff?: Buff.Buff) {
        this.status.checkBuffs(this.time);
    
        const total = accuracy + this.status.stats.dodge;
        const hitChangeRoll = Math.ceil(Math.random() * total);
    
        if (hitChangeRoll > accuracy) {
            this.newEvent(new fightEvents.Dodge(this.time, this.index));
            return;
        }

        if (Math.ceil(Math.random() * 100) >= critChance) {
            damage = damage * 5 - this.status.stats.armor;
            this.newEvent(new fightEvents.Crit(this.time, this.index, critDebuff, critBuff));
        } else
            damage -= this.status.stats.armor; //applied here so that armor is calculated before the buff is applied when there is a crit

        if (damage < 0)
            damage = 0;
        else if (damage > this.status.hitPoints)
            damage = this.status.stats.maxHitPoints;
        this.newEvent(new fightEvents.Damage(this.time, this.index, damage));
            
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
