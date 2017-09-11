import * as Reel from '../Reel';

export interface Stats {
    hitPoints: number;
    accuracy: number;
    dodge: number;
    attackSpeed: number;
    attackDamage: number;
    armor: number;
    regeneration: number;
}

export class Combatant {
    private attCD = 0;
    private fighting: boolean = false;
    private chance: Chance.Chance;
    constructor(
        private readonly id: number,
        private readonly name: string,
        private stats: {
            hitPoints: number; // hit points (max is 1000)
            accuracy: number;
            dodge: number;
            attackSpeed: number; // attacks per millisecond
            attackDamage: number;
            armor: number; // damage reduction
            regeneration: number; // after a fight char will be healed by this amount
        },
        private readonly deathEvent: (combatant: Combatant) => void,
        private readonly attackEvent: (combatant: Combatant, damage: number, accuracy: number) => void,
        private readonly reelEvent: (combatant: Combatant, event: Reel.CombatantEvent) => void

    ) {}
    toString() {
        return this.name;
    }
    public tick(timeDelta: number) {
        if (this.fighting) {
            this.attCD = this.attCD + timeDelta;
            if (this.attCD >= this.stats.attackSpeed - 150 && this.attCD - timeDelta <= this.stats.attackSpeed - 150)
                this.reelEvent(this, new Reel.AttackUpdate(0, 0));
            if (this.attCD >= this.stats.attackSpeed) {
                this.attackEvent(this, this.stats.attackDamage, this.stats.accuracy);
                this.attCD = this.attCD - this.stats.attackSpeed;
            }
        }
    }
    public donate(amount: number) {
        this.stats.accuracy = this.stats.accuracy + amount;
        this.stats.dodge = this.stats.accuracy + amount;
        this.stats.hitPoints = this.stats.hitPoints + amount;
        this.reelEvent(this, new Reel.HealthUpdate(0, 0, this.stats.hitPoints)); //todo
    }
    public getID() {
        return this.id;
    }
    //change mode
    fight() {
        this.fighting = true;
        this.attCD = this.stats.attackSpeed;
    }
    //change mode
    wait() {
        this.fighting = false;
    }
    public takeHit(damage: number, accuracy: number) {
        let total: number;
        let roll: number;
    
        total = accuracy + this.stats.dodge;
        roll = this.chance.integer({min: 1, max: total});
        if (roll > accuracy) {
            console.log(this.name + " " + this.id + " dodged the attack! =D");
            this.reelEvent(this, new Reel.TextUpdate(0, 0, 'dodge', 'orange')); //todo
            return;
        }

        console.log(this.name + " " + this.id + " was hit! Yikes!!! >_<");

        damage -= this.stats.armor;
        if (damage < 0)
            damage = 0;
        this.stats.hitPoints -= damage;
        if (this.stats.hitPoints < 0)
            this.stats.hitPoints = 0;
        this.reelEvent(this, new Reel.HealthUpdate(0, 0, this.stats.hitPoints)); //todo
        console.log(this.name + " " + this.id + " Has taken " + damage + "! :(");
        this.reelEvent(this, new Reel.TextUpdate(0, 0, String(damage), 'red')); //todo
        if (this.stats.hitPoints <= 0) {
            console.log(this.name + " " + this.id + " Has been slain! Their body lies motionless on the floor... ;-;");
            this.deathEvent(this);
        }
    }
    public heal() {
        this.stats.hitPoints += this.stats.regeneration * 1000;
        if (this.stats.hitPoints > 1000)
            this.stats.hitPoints = 1000;
        this.reelEvent(this, new Reel.HealthUpdate(0, 0, this.stats.hitPoints)); //todo
    }
    public isDead() {
        if (this.stats.hitPoints <= 0)
            return true;
        return false;
    }
    public setChance(chance: Chance.Chance) {
        this.chance = chance;
    }
}
