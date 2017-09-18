//import * as Status from './Status';
import * as fightReel from './fightReel';
import * as buff from './buff';
import * as characterPicker from './characterPicker';

import { Status } from '../shared/Status';

export class Combatant {
    public time: number = 0;

    constructor(
        public readonly status: Status,
        public readonly index: number,
        private readonly newEvent: (event: fightReel.Event) => void,
        private readonly attackEvent: (combatant: Combatant, damage: number, accuracy: number, critChance: number, critDebuff: buff.Buff) => void
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

        this.attackEvent(this, damageRoll, stats.accuracy, stats.crit, characterPicker.characters[this.status.character].critDebuff
        );
    }
    public takeHit(damage: number, accuracy: number, critChance: number, critDebuff: buff.Buff) {
        this.status.checkBuffs(this.time);
    
        const total = accuracy + this.status.stats.dodge;
        const damageRoll = Math.ceil(Math.random() * total);
    
        if (damageRoll > accuracy) {
            this.newEvent(new fightReel.DodgeEvent(this.time, this.index));
            return;
        }

        if (Math.ceil(Math.random() * 100) >= critChance) {
            damage = damage * 5 - this.status.stats.armor;
            this.status.addEffect(this.time + critDebuff.duration, critDebuff);
            this.newEvent(new fightReel.CritEvent(this.time, this.index, critDebuff));
        } else
            damage -= this.status.stats.armor; //applied here so that armor is calculated before the buff is applied when there is a crit

        if (damage < 0)
            damage = 0;
        else if (damage > this.status.hitPoints)
            damage = this.status.stats.maxHitPoints;
        this.status.hitPoints -= damage;
        this.newEvent(new fightReel.DamageEvent(this.time, this.index, damage));
            
        if (this.status.hitPoints <= 0)
            this.newEvent(new fightReel.DeathEvent(this.time, this.index));
    }
    public heal() {
        this.status.checkBuffs(this.time);

        let healingAmount = this.status.stats.regeneration * 1000;

        if (healingAmount + this.status.hitPoints > 1000)
            healingAmount = 1000 - this.status.hitPoints;

        this.status.hitPoints += this.status.stats.regeneration * 1000;
        this.newEvent(new fightReel.HealingEvent(this.time, this.index, healingAmount));
    }
    public isDead() {
        if (this.status.hitPoints <= 0)
            return true;
        return false;
    }
}
