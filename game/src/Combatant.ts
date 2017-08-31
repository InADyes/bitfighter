namespace Combatant {

export class Combatant extends Actor{
    private id: number;
    private name: string;
    private iconImage = new Image();
    private attCD = 0;
    private stats: {
            hitPoints: number; // hit points (max is 1000)
            accuracy: number;
            dodge: number;
            attackSpeed: number; // attacks per millisecond
            attackDamage: number;
            armor: number; // damage reduction
            regeneration: number; // after a fight char will be healed by this amount
    };
    private healthBar: HealthBar;
    private sprite: Sprite;
    private static healthBarOffset = {x: 0, y: 150};
    private opponent: Combatant | null;
    constructor(
        ctx: CanvasRenderingContext2D,
        pos: {x: number, y: number},
        id: number,
        name: string,
        icon: string,
        sprite: string,
        stats: {
            hitPoints: number;
            accuracy: number;
            dodge: number;
            attackSpeed: number;
            attackDamage: number;
            armor: number;
            regeneration: number;
        }
    ) {
        super(ctx, pos);
        this.id = id;
        this.name = name;
        this.iconImage.src = icon; 
        this.stats = stats;
        this.healthBar = new HealthBar(ctx, {
            x: pos.x + Combatant.healthBarOffset.x,
            y: pos.y + Combatant.healthBarOffset.y
        });
        this.sprite = new Sprite(ctx, {x: pos.x, y: pos.y}, sprite);
    }
    toString() {
        return this.name;
    }
    public setOpponent(opponent: Combatant | null) {
        this.opponent = opponent;
    }
    public tick(timeDelta: number) {
        if (this.opponent)
        if (this.opponent) {
            this.attCD = this.attCD + timeDelta;
            if (this.attCD >= this.stats.attackSpeed) {
                this.attack(this.opponent);
                this.attCD = this.attCD - this.stats.attackSpeed;
            }
        }
        else
            this.attCD = 0;
        this.healthBar.tick(timeDelta);
        this.sprite.tick(timeDelta);
    }
    public draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.font = "15px Arial";
        this.ctx.fillText(this.name, this.pos.x + 40, this.pos.y + 140);
        this.ctx.drawImage(this.iconImage, this.pos.x, this.pos.y + 120)
        this.ctx.fillStyle = 'black';
        this.ctx.fillText("DMG: " + String(this.stats.attackDamage), this.pos.x, this.pos.y + 170);
        this.healthBar.draw();
        this.sprite.draw();
    }
    public donate(amount: number) {
        this.stats.accuracy = this.stats.accuracy + amount;
        this.stats.dodge = this.stats.accuracy + amount;
        this.stats.hitPoints = this.stats.hitPoints + amount;
        this.healthBar.setHealth(this.stats.hitPoints)
    }
    public getID() {
        return this.id;
    }
    public setPosition(pos: {x: number, y: number}) {
        this.pos = pos;
        this.healthBar.setPosition({
            x: pos.x + Combatant.healthBarOffset.x,
            y: pos.y + Combatant.healthBarOffset.y
        });
        this.sprite.setPosition(this.pos);
    }
    private attack(opponent: Combatant) {
        let total:      number;
        let roll:       number;
    
        total = this.stats.accuracy + opponent.stats.dodge;
        roll = Math.ceil(Math.random() * total);
        if (roll <= this.stats.accuracy){
            console.log(this.name + " " + this.id + " Has hit! =D");
            opponent.takeHit(this.stats.attackDamage);
        } else {
            console.log(this.name + " " + this.id + " Missed the attack! Yikes!!! >_<");
        }
    }
    private takeHit(damage: number) {
        if (this.stats.armor >= damage)
            return;
    
        this.stats.hitPoints -= damage - this.stats.armor;
        this.healthBar.setHealth(this.stats.hitPoints);
        this.sprite.shake();
        console.log(this.name + " " + this.id + " Has taken " + damage + "! :(");
        if (this.stats.hitPoints <= 0)
            console.log(this.name + " " + this.id + " Has been slain! Their body lies motionless on the floor... ;-;");
    }
    public isDead() {
        if (this.stats.hitPoints <= 0)
            return true;
        return false;
    }
}

class HealthBar extends Actor {
    private targetHealth: number = HealthBar.maxValue;
    private displayedYellow: number = HealthBar.maxValue;
    

    private static yellowBarFollowRate: number = 7; //per millesecond
    private static healthToPixels: number = 15; //health units per pixel
    private static height: number = 6; //health bar height
    private static maxValue = 1000; //health bar max value

    public draw() {
       
        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(this.pos.x, this.pos.y, HealthBar.maxValue / HealthBar.healthToPixels, HealthBar.height);
        this.ctx.fillStyle = 'orange';
        this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.displayedYellow / HealthBar.healthToPixels), HealthBar.height);
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.targetHealth / HealthBar.healthToPixels), HealthBar.height);
    }
    public tick(timeDelta: number) {
        if (this.targetHealth < this.displayedYellow) {
            this.displayedYellow -= timeDelta / HealthBar.yellowBarFollowRate;
            if (this.targetHealth > this.displayedYellow)
                this.displayedYellow = this.targetHealth;
        }
    }
    public setHealth(health: number) {
        this.targetHealth = health;
    }
}

class Sprite extends Actor {
    private spriteImage = new Image();
    private countdown: number = 0;

    private static countdownStart = Math.PI * 3;
    private static shakeAmplitude = 10;
    private static timeToAmplitueRatio = 75;

    constructor(ctx: CanvasRenderingContext2D,  pos: {x: number, y: number}, sprite: string) {
        super(ctx ,pos);
        this.spriteImage.src = sprite;
    }
    public draw() { this.ctx.drawImage(
            this.spriteImage,
            this.pos.x + Math.floor(Math.sin(this.countdown) * Sprite.shakeAmplitude),
            this.pos.y
        );
    }
    public shake() {
        this.countdown = Sprite.countdownStart;
    }
    public tick(timeDelta: number) {
        this.countdown -= timeDelta / Sprite.timeToAmplitueRatio;
        if (this.countdown < 0)
            this.countdown = 0;
    }
}

}
