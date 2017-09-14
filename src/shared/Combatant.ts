import { Status } from './statusTypes';

export class Combatant {
    public time = 0;

    constructor(
        public status: Status,
    
        private readonly deathEvent: (combatant: Combatant) => void,
        private readonly attackEvent: (combatant: Combatant, damage: number, accuracy: number, crit: number) => void,
        private readonly dodgeEvent: (combatant: Combatant) => void,
        private readonly damageEvent: (combatant: Combatant, damage: number) => void,
        private readonly healingEvent: (combatant: Combatant, healing: number) => void,
        private readonly critEvent: (combatant: Combatant, type: number) => void
    ) {}
    public attack() {
        let stats = this.status.stats;
    
        this.time += Math.ceil(Math.random() * (stats.attackSpeed.max - stats.attackSpeed.min)) + stats.attackSpeed.min;

        let damageRoll = Math.ceil(Math.random() * (stats.attackDamage.max - stats.attackDamage.min)) + stats.attackDamage.min;

        this.attackEvent(this, damageRoll, stats.accuracy, stats.crit);
    }
    public takeHit(damage: number, accuracy: number, crit: number) {
        let total: number;
        let roll: number;
    
        total = accuracy + this.status.stats.dodge;
        roll = Math.ceil(Math.random() * total);
        if (roll > accuracy) {
            // console.log(this.status.name + ' ' + this.status.id + ' dodged the attack! =D');
            this.dodgeEvent(this);
            return;
        }

        roll = Math.ceil(Math.random() * 100);
        if (roll >= crit) {
            damage = damage * 3 - this.status.stats.armor
            if (damage < 0)
                damage = 0;
            else if (damage > this.status.hitPoints)
                damage = this.status.stats.maxHitPoints;
            this.status.hitPoints -= damage;
            this.critEvent(this, 0);
            // console.log(this.status.name + ' ' + this.status.id + ' took a crit! That looked painful! O_O');
        }
        else {
            // console.log(this.status.name + ' ' + this.status.id + ' was hit! Yikes!!! >_<');
            damage -= this.status.stats.armor;
            if (damage < 0)
                damage = 0;
            else if (damage > this.status.hitPoints)
                damage = this.status.stats.maxHitPoints;
            this.status.hitPoints -= damage;
            this.damageEvent(this, damage);
        }
            // console.log(this.status.name + ' ' + this.status.id + ' Has taken ' + damage + '! :(');
            
        if (this.status.hitPoints <= 0) {
            // console.log(this.status.name + ' ' + this.status.id + ' Has been slain! Their body lies motionless on the floor... ;-;');
            this.deathEvent(this);
        }
    }
    public heal() {
        let healingAmount = this.status.stats.regeneration * 1000;

        if (healingAmount + this.status.hitPoints > 1000)
            healingAmount = 1000 - this.status.hitPoints;

        this.status.hitPoints += this.status.stats.regeneration * 1000;
        this.healingEvent(this, healingAmount);
    }
    public isDead() {
        if (this.status.hitPoints <= 0)
            return true;
        return false;
    }
}