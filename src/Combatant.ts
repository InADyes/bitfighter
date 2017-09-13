import * as Actor from './Actor';

export interface Stats {
    hitPoints: number;
    accuracy: number;
    dodge: number;
    attackSpeed: number;
    attackDamage: number;
    armor: number;
    regeneration: number;
}

export class Combatant extends Actor.Actor {
    public deathEvent: (combatant: Combatant) => void;
    public attackEvent: (combatant: Combatant, damage: number, accuracy: number) => void;

    private id: number;
    private name: string;
    // private iconImage = new Image();
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
    private static healthBarOffset = { x: 0, y: 130 };
    private sprite: Sprite;
    private textOut: TextOut;
    private static textOutOffset = { x: 30, y: 0 };
    private fighting: boolean = false;
    private chance: Chance.Chance;
    constructor(
        ctx: CanvasRenderingContext2D,
        pos: { x: number, y: number },
        id: number,
        name: string,
        // icon: string,
        sprite: string,
        stats: {
            hitPoints: number;
            accuracy: number;
            dodge: number;
            attackSpeed: number;
            attackDamage: number;
            armor: number;
            regeneration: number;
        },
        deathEvent: (combatant: Combatant) => void,
        attackEvent: (combatant: Combatant, damage: number, accuracy: number) => void,
        chance: Chance.Chance

    ) {
        super(ctx, pos);
        this.id = id;
        this.name = name;
        // this.iconImage.src = icon; 
        this.stats = stats;
        this.healthBar = new HealthBar(ctx, {
            x: pos.x + Combatant.healthBarOffset.x,
            y: pos.y + Combatant.healthBarOffset.y
        });
        this.sprite = new Sprite(ctx, { x: pos.x, y: pos.y }, sprite);
        this.textOut = new TextOut(ctx, {
            x: pos.x + Combatant.textOutOffset.x,
            y: pos.y + Combatant.textOutOffset.y
        });
        this.deathEvent = deathEvent;
        this.attackEvent = attackEvent;
        this.chance = chance;
    }
    toString() {
        return this.name;
    }
    public tick(timeDelta: number) {
        if (this.fighting) {
            this.attCD = this.attCD + timeDelta;
            if (this.attCD >= this.stats.attackSpeed - 150 && this.attCD - timeDelta <= this.stats.attackSpeed - 150)
                this.sprite.attackAnimation();
            if (this.attCD >= this.stats.attackSpeed) {
                this.attackEvent(this, this.stats.attackDamage, this.stats.accuracy);
                this.attCD = this.attCD - this.stats.attackSpeed;
                this.attCD += Math.ceil((this.stats.attackSpeed * 3 / 4 - this.stats.attackSpeed * 3 / 2) * Math.random());
            }
        }
        this.healthBar.tick(timeDelta);
        this.sprite.tick(timeDelta);
        this.textOut.tick(timeDelta);
    }
    public draw() {


        this.healthBar.draw();
        this.sprite.draw();
        if (this.ctx.canvas.height > 100) {
            this.ctx.fillStyle = 'black';
            this.ctx.strokeStyle = 'white';
            this.ctx.font = "10px Arial";
            this.ctx.lineWidth = 1;
            this.ctx.strokeText(this.name, this.pos.x + 25, this.pos.y + 122);
            this.ctx.fillText(this.name, this.pos.x + 25, this.pos.y + 122);
        }
        else {
            if (this.pos.x < 50) {
                this.ctx.fillStyle = 'black';
                this.ctx.strokeStyle = 'white';
                this.ctx.font = "10px Arial";
                this.ctx.lineWidth = 1;
                this.ctx.strokeText(this.name, this.pos.x + 25, this.pos.y + 47);
                this.ctx.fillText(this.name, this.pos.x + 25, this.pos.y + 47);
            }
            else{
                this.ctx.fillStyle = 'black';
                this.ctx.strokeStyle = 'white';
                this.ctx.font = "10px Arial";
                this.ctx.lineWidth = 1;
                this.ctx.strokeText(this.name, this.pos.x + 65, this.pos.y + 47);
                this.ctx.fillText(this.name, this.pos.x + 65, this.pos.y + 47);
            }
        }//  this.ctx.drawImage(this.iconImage, this.pos.x, this.pos.y + 105);
        this.textOut.draw();


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
    //change mode
    fight() {
        this.fighting = true;
        this.attCD = this.stats.attackSpeed;
    }
    //change mode
    wait() {
        this.fighting = false;
    }
    /* public getIcon() {
         return this.iconImage;
     }*/
    public setPosition(pos: { x: number, y: number }) {
        this.pos = pos;
        this.healthBar.setPosition({
            x: pos.x + Combatant.healthBarOffset.x,
            y: pos.y + Combatant.healthBarOffset.y
        });
        this.sprite.setPosition(this.pos);
        this.textOut.setPosition({
            x: pos.x + Combatant.textOutOffset.x,
            y: pos.y + Combatant.textOutOffset.y
        });
    }
    public takeHit(damage: number, accuracy: number) {
        let total: number;
        let roll: number;
        let dodgesound = new Audio("sounds/Dodge.wav");
        let normalhitsound = new Audio("sounds/Normal-hit.wav");
        let deathsound = new Audio("sounds/death_loud_ver_2.wav");

        total = accuracy + this.stats.dodge;
        roll = this.chance.integer({ min: 1, max: total });
        if (roll > accuracy) {
            console.log(this.name + " " + this.id + " dodged the attack! =D");
            this.textOut.add('dodge', 'orange');
            dodgesound.play();
            return;
        }

        console.log(this.name + " " + this.id + " was hit! Yikes!!! >_<");


        normalhitsound.play();

        damage -= this.stats.armor;
        if (damage < 0)
            damage = 0;
        this.stats.hitPoints -= damage;
        if (this.stats.hitPoints < 0)
            this.stats.hitPoints = 0;
        this.healthBar.setHealth(this.stats.hitPoints);
        console.log(this.name + " " + this.id + " Has taken " + damage + "! :(");
        this.textOut.add(String(damage), 'red');
        if (this.stats.hitPoints <= 0) {
            console.log(this.name + " " + this.id + " Has been slain! Their body lies motionless on the floor... ;-;");
            deathsound.play();
            this.deathEvent(this);
        }
    }
    public heal() {
        this.stats.hitPoints += this.stats.regeneration * 1000;
        if (this.stats.hitPoints > 1000)
            this.stats.hitPoints = 1000;
        this.healthBar.setHealth(this.stats.hitPoints);
    }
    public setFacingDirection(left: boolean) {
        this.sprite.setFacingDirection(left);
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

class HealthBar extends Actor.Actor {
    private targetHealth: number = 1000;
    private redHealth: number = 1000;
    private displayedYellow: number = 1000;


    private static yellowBarFollowRate: number = 7; //per millesecond
    private static healthToPixels1: number = 10; //health units per pixel
    private static healthToPixels2: number = 15;
    private static height: number = 6; //health bar height



    public draw() {
        let backimgG = new Image();
        let backimgR = new Image();
        let backimgY = new Image();
        backimgG.src = "images/greenback.png";
        backimgR.src = "images/redback.png";
        backimgY.src = "images/yellowback.png";

        if (this.ctx.canvas.height > 100) {
            this.ctx.fillStyle = 'grey';
            this.ctx.fillRect(this.pos.x, this.pos.y, 1000 / HealthBar.healthToPixels2, HealthBar.height);
            this.ctx.fillStyle = 'orange';
            this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.displayedYellow / HealthBar.healthToPixels2), HealthBar.height);
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.redHealth / HealthBar.healthToPixels2), HealthBar.height);
        }
        else {
            if (this.pos.x < 50) {
                //this.ctx.fillStyle = 'green';
                this.ctx.drawImage(backimgG, this.pos.x, this.pos.y - 160, 1000 / HealthBar.healthToPixels1, this.ctx.canvas.height);
                //this.ctx.fillRect(this.pos.x, this.pos.y - 160, 1000 / HealthBar.healthToPixels1, this.ctx.canvas.height);
                //this.ctx.fillStyle = 'yellow';
                this.ctx.drawImage(backimgY, this.pos.x, this.pos.y - 160, Math.round(this.displayedYellow / HealthBar.healthToPixels1), this.ctx.canvas.height);
                //this.ctx.fillRect(this.pos.x, this.pos.y - 160, Math.round(this.displayedYellow / HealthBar.healthToPixels1), this.ctx.canvas.height);
                //this.ctx.fillStyle = 'red';
                this.ctx.drawImage(backimgR, this.pos.x, this.pos.y - 160, Math.round(this.redHealth / HealthBar.healthToPixels1), this.ctx.canvas.height);
                //this.ctx.fillRect(this.pos.x, this.pos.y - 160, Math.round(this.redHealth / HealthBar.healthToPixels1), this.ctx.canvas.height);
            }
            else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                //this.ctx.fillStyle = 'green';
                //this.ctx.fillRect(this.pos.x - 295, this.pos.y - 160, 1000 / HealthBar.healthToPixels1, this.ctx.canvas.height);
                this.ctx.drawImage(backimgG,this.pos.x - 295, this.pos.y - 160, 1000 / HealthBar.healthToPixels1, this.ctx.canvas.height);
                //this.ctx.fillStyle = 'yellow';
                //this.ctx.fillRect(this.pos.x - 295, this.pos.y - 160, Math.round(this.displayedYellow / HealthBar.healthToPixels1), this.ctx.canvas.height);
                this.ctx.drawImage(backimgY,this.pos.x - 295, this.pos.y - 160, Math.round(this.displayedYellow / HealthBar.healthToPixels1), this.ctx.canvas.height);
               // this.ctx.fillStyle = 'red';
                //this.ctx.fillRect(this.pos.x - 295, this.pos.y - 160, Math.round(this.redHealth / HealthBar.healthToPixels1), this.ctx.canvas.height);
                this.ctx.drawImage(backimgR, this.pos.x - 295, this.pos.y - 160, Math.round(this.redHealth / HealthBar.healthToPixels1), this.ctx.canvas.height);
                this.ctx.restore();
            }
        }
    }
    public tick(timeDelta: number) {
        if (this.redHealth < this.displayedYellow) {
            this.displayedYellow -= timeDelta / HealthBar.yellowBarFollowRate;
            if (this.redHealth > this.displayedYellow)
                this.displayedYellow = this.redHealth;
        }
        if (this.redHealth < this.targetHealth)
            this.redHealth += timeDelta / HealthBar.yellowBarFollowRate;
    }
    public setHealth(health: number) {
        this.targetHealth = health;
        if (this.redHealth > this.targetHealth)
            this.redHealth = this.targetHealth;
    }
}

class Sprite extends Actor.Actor {
    private spriteImage = new Image();
    private countdown: number = 0;
    private facingLeft = false;

    private static countdownStart = Math.PI;
    private static shakeAmplitude = 10;
    private static timeToAmplitueRatio = 75;

    constructor(ctx: CanvasRenderingContext2D, pos: { x: number, y: number }, sprite: string) {
        super(ctx, pos);
        this.spriteImage.src = sprite;
    }
    public draw() {
        let offset = Math.floor(Math.sin(this.countdown) * Sprite.shakeAmplitude);
        if (this.ctx.canvas.height > 100) {
            if (this.facingLeft) {
                this.ctx.save()
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(
                    this.spriteImage,
                    this.facingLeft ? -(this.pos.x + 70 - offset) : -(this.pos.x + 70 + offset),
                    this.pos.y
                );
                this.ctx.restore();
            } else {
                this.ctx.drawImage(
                    this.spriteImage,
                    this.facingLeft ? this.pos.x - offset : this.pos.x + offset,
                    this.pos.y
                );
            }
        }
        else {
            if (this.facingLeft) {
                this.ctx.save();
                this.ctx.scale(-1, 0.5);
                this.ctx.drawImage(
                    this.spriteImage,
                    this.facingLeft ? -(this.pos.x + 110 - offset) : -(this.pos.x + 110 + offset),
                    this.pos.y
                );
                this.ctx.restore();
            } else {
                this.ctx.save();
                this.ctx.scale(1, 0.5);
                this.ctx.drawImage(
                    this.spriteImage,
                    this.facingLeft ? this.pos.x - offset : this.pos.x + offset,
                    this.pos.y
                );
                this.ctx.restore();
            }
        }


    }
    public attackAnimation() {
        this.countdown = Sprite.countdownStart;
    }
    public tick(timeDelta: number) {
        this.countdown -= timeDelta / Sprite.timeToAmplitueRatio;
        if (this.countdown < 0)
            this.countdown = 0;
    }
    public setFacingDirection(left: boolean) {
        this.facingLeft = left;
    }
}

class TextOut extends Actor.Actor {
    private static timeout = 5000;
    private static offsetRatio = 50;

    private displayedText: {
        text: string,
        timeout: number,
        color: string
    }[] = [];
    public tick(timeDelta: number) {
        this.displayedText.forEach(e => e.timeout += timeDelta);
        this.displayedText = this.displayedText.filter(e => e.timeout < TextOut.timeout);
    }
    public draw() {
        this.ctx.strokeStyle = 'black';
        this.ctx.font = "10px Arial";
        this.displayedText.forEach(e => {
            this.ctx.fillStyle = e.color;
            if (this.pos.x < 50) {
                this.ctx.strokeText(e.text, this.pos.x - 5, this.pos.y - 10 - e.timeout / TextOut.offsetRatio);
                this.ctx.fillText(e.text, this.pos.x - 5, this.pos.y - 10 - e.timeout / TextOut.offsetRatio);
            }
            else {
                this.ctx.strokeText(e.text, this.pos.x + 25, this.pos.y - 10 - e.timeout / TextOut.offsetRatio);
                this.ctx.fillText(e.text, this.pos.x + 25, this.pos.y - 10 - e.timeout / TextOut.offsetRatio);
            }
        });
    }
    public add(text: string, color: string) {
        this.displayedText.push({ text: text, timeout: 0, color: color });
    }
}
