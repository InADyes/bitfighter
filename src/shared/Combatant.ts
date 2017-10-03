import * as FightEvents from './fightEvents';
import * as Buff from './buff';
import * as characterPicker from './characterPicker';
import { Status } from '../shared/Status';


interface attackProps {
    time: number,
    attacker: Combatant,
    damage: number,
    accuracy: number,
    critChanceModifier: number,
    critDamageModifier: number
    crits: {
        odds: number,
        debuff?: Buff.Buff,
        buff?: Buff.Buff,
        damageMultiplier?: number
    }[]
}

export class Combatant {
    public time: number = 0;

    constructor(
        public readonly status: Status,
        public readonly index: number,
        private readonly newEvent: (event: FightEvents.Event) => void,
        private readonly attackCallback: (attack: attackProps) => void
    ) {
        this.rollAttackSpeed();
    }
    // increase internal timer by attack speed;
    private rollAttackSpeed() {
        this.time += Math.ceil(Math.random() * (this.status.stats.attackSpeed.max - this.status.stats.attackSpeed.min)) + this.status.stats.attackSpeed.min;
    }

    public attack() {
        this.newEvent(new FightEvents.Attack(
            this.time,
            this.index
        ));

        this.status.checkBuffs(this.time);

        const stats = this.status.stats;
    
        this.rollAttackSpeed();

        const damageRoll = Math.ceil(Math.random() * (stats.attackDamage.max - stats.attackDamage.min)) + stats.attackDamage.min;

        this.attackCallback({
            time: this.time,
            attacker: this,
            damage: damageRoll,
            accuracy: stats.accuracy,
            critDamageModifier: stats.critDamageModifier,
            critChanceModifier: stats.critChanceModifier,
            crits: characterPicker.characters[this.status.character].crits
        });
    }
    public takeHit(attack: attackProps) {
    
        const total = attack.accuracy + this.status.stats.dodge;
        const hitChangeRoll = Math.ceil(Math.random() * total);
    
        if (hitChangeRoll > attack.accuracy) {
            this.newEvent(new FightEvents.Dodge(attack.time, this.index));
            return;
        }

        attack.damage -= this.status.stats.armor // applied before crit multipliers

        for (let crit of attack.crits) {
            if (Math.ceil(Math.random() * 100) <= crit.odds * attack.critChanceModifier) {
                if (crit.damageMultiplier)
                    attack.damage = (attack.damage - this.status.stats.armor) * crit.damageMultiplier * attack.critDamageModifier;
                this.newEvent(new FightEvents.Crit(attack.time, this.index, crit.debuff, crit.buff));
            }
        }

        if (attack.damage < 0)
            attack.damage = 0;
        else if (attack.damage > this.status.hitPoints)
            attack.damage = this.status.hitPoints;
        this.newEvent(new FightEvents.Damage(attack.time, this.index, attack.damage));
            
        if (this.status.hitPoints <= 0)
            this.newEvent(new FightEvents.Death(attack.time, this.index));
    }
    public heal() {
        this.status.checkBuffs(this.time);
        const maxHitPoints = this.status.stats.maxHitPoints;

        let healingAmount = this.status.stats.regeneration + maxHitPoints;

        if (healingAmount + this.status.hitPoints > maxHitPoints)
            healingAmount = maxHitPoints - this.status.hitPoints;

        // allways heals the first character in the future, needs to be changed
        this.newEvent(new FightEvents.Healing(this.time + 200, 0, healingAmount));
    }
}
