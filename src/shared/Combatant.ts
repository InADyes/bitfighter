import { Status, Stats } from './statusTypes';
import * as fightReel from './fightReel';
import * as buff from './buff';

export class Combatant {
    public time: number = 0;
    private alias: Alias;

    constructor(
        public readonly status: Status,
        public readonly index: number,
        private readonly newEvent: (event: fightReel.Event) => void,
        private readonly attackEvent: (combatant: Combatant, damage: number, accuracy: number, crit: number) => void
    ) {
        this.rollAttackSpeed();
        this.alias = new Alias(status.stats);
    }
    // increase internal timer by attack speed;
    private rollAttackSpeed() {
        this.time += Math.ceil(Math.random() * (this.alias.stats.attackSpeed.max - this.alias.stats.attackSpeed.min)) + this.alias.stats.attackSpeed.min;
    }

    public attack() {
        this.alias.clearBuffs(this.time);

        const stats = this.alias.stats;
    
        this.rollAttackSpeed();

        const damageRoll = Math.ceil(Math.random() * (stats.attackDamage.max - stats.attackDamage.min)) + stats.attackDamage.min;

        this.attackEvent(this, damageRoll, stats.accuracy, stats.crit);
    }
    public takeHit(damage: number, accuracy: number, crit: number) {
        this.alias.clearBuffs(this.time);

        let total: number;
        let roll: number;
    
        total = accuracy + this.alias.stats.dodge;
        roll = Math.ceil(Math.random() * total);
        if (roll > accuracy) {
            // console.log(this.status.name + ' ' + this.status.id + ' dodged the attack! =D');
            this.newEvent(new fightReel.DodgeEvent(this.time, this.index));
            return;
        }

        roll = Math.ceil(Math.random() * 100);
        if (roll >= crit) {
            damage = damage * 3 - this.alias.stats.armor
            if (damage < 0)
                damage = 0;
            else if (damage > this.status.hitPoints)
                damage = this.alias.stats.maxHitPoints;
            this.status.hitPoints -= damage;
            this.newEvent(new fightReel.CritEvent(this.time, this.index, 0));
            // console.log(this.status.name + ' ' + this.status.id + ' took a crit! That looked painful! O_O');
        }
        else {
            // console.log(this.status.name + ' ' + this.status.id + ' was hit! Yikes!!! >_<');
            damage -= this.alias.stats.armor;
            if (damage < 0)
                damage = 0;
            else if (damage > this.status.hitPoints)
                damage = this.alias.stats.maxHitPoints;
            this.status.hitPoints -= damage;
            this.newEvent(new fightReel.DamageEvent(this.time, this.index, damage));
        }
            // console.log(this.status.name + ' ' + this.status.id + ' Has taken ' + damage + '! :(');
            
        if (this.status.hitPoints <= 0) {
            // console.log(this.status.name + ' ' + this.status.id + ' Has been slain! Their body lies motionless on the floor... ;-;');
            this.newEvent(new fightReel.DeathEvent(this.time, this.index));
        }
    }
    public heal() {
        this.alias.clearBuffs(this.time);

        let healingAmount = this.alias.stats.regeneration * 1000;

        if (healingAmount + this.status.hitPoints > 1000)
            healingAmount = 1000 - this.status.hitPoints;

        this.status.hitPoints += this.alias.stats.regeneration * 1000;
        this.newEvent(new fightReel.HealingEvent(this.time, this.index, healingAmount));
    }
    public isDead() {
        if (this.status.hitPoints <= 0)
            return true;
        return false;
    }
}

class Alias {
    private buffs: {
        expires: number,
        buff: buff.Buff
    }[];

    constructor(
        private original: Stats
    ) {}
    addEffect(expires: number, buff: buff.Buff) {
        this.buffs.push({expires: expires, buff: buff});
    }
    clearBuffs(time: number) {
        this.buffs = this.buffs.filter(buff => {
            buff.expires > time;
        });
    }
    get stats() { //dumb slow method
        let stats = Object.assign({}, this.original);

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
}
