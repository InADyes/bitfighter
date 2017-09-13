import * as FightReel from './FightReel';
import { Status } from './Combatant';

export function buildFightReel(combatants: Status[]) {
    let everyoneAlive = true;
    let reel: FightReel.Event[] = [];
    let c = combatants.map((combatant) => new Combatant(
        combatant,
        caller => {
            reel.push(new FightReel.DeathEvent(
                caller.time,
                c.indexOf(caller)
            ));
            everyoneAlive = false;
        },
        (caller, damage, accuracy) => {
            let opponents = c.filter(c => c != caller);
            opponents[0].takeHit(damage, accuracy); // todo: maybe bug?
        },
        caller => {
            reel.push(new FightReel.DodgeEvent(
                caller.time,
                c.indexOf(caller)
            ));
        },
        (caller, damage) => {
            reel.push(new FightReel.DamageEvent(
                caller.time,
                c.indexOf(caller),
                damage
            ));
        },
        (caller, healing) => {
            reel.push(new FightReel.HealingEvent(
                caller.time,
                c.indexOf(caller),
                healing
            ));
        }
    ));

    if (combatants.length < 2) {
        console.error('not enough combatants to fight');
        return;
    }

    while (everyoneAlive) {
        if (c[0].time <= c[1].time)
            c[0].attack();
        else
            c[1].attack();
    }

    return { combatants: c.filter(c => c.isDead() == false).map(c => c.status), reel }
}

export class Combatant {
    public time = 0;

    constructor(
        public status: Status,
    
        private readonly deathEvent: (combatant: Combatant) => void,
        private readonly attackEvent: (combatant: Combatant, damage: number, accuracy: number) => void,
        private readonly dodgeEvent: (combatant: Combatant) => void,
        private readonly damageEvent: (combatant: Combatant, damage: number) => void,
        private readonly healingEvent: (combatant: Combatant, healing: number) => void
    ) {}
    public getID() {
        return this.status.id;
    }
    public attack() {
        this.time += this.status.stats.attackSpeed;
        this.attackEvent(this, this.status.stats.attackDamage, this.status.stats.accuracy);
    }
    public takeHit(damage: number, accuracy: number) {
        let total: number;
        let roll: number;
    
        total = accuracy + this.status.stats.dodge;
        roll = Math.ceil(Math.random() * total);
        if (roll > accuracy) {
            // console.log(this.status.name + ' ' + this.status.id + ' dodged the attack! =D');
            this.dodgeEvent(this);
            return;
        }

        // console.log(this.status.name + ' ' + this.status.id + ' was hit! Yikes!!! >_<');

        //calculate damage
        damage -= this.status.stats.armor;
        if (damage < 0)
            damage = 0;
        else if (damage > this.status.hitPoints)
            damage = this.status.stats.maxHitPoints;

        this.status.hitPoints -= damage;
        this.damageEvent(this, damage);
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
