namespace Combatant {

export class Combatant extends Actor{
    private id: number;
    private name: string;
    private iconImage = new Image();
    private attCD = 0;
    private dmgChk = false;
    private stats: {
            hp: number;
            att: number;
            def: number;
            attspd: number;
            dmg: number;
            armr: number;
            regen: number;
    };
    private healthBar: HealthBar;
    private sprite: Sprite;
    public graveyard: Graveyard;
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
            hp: number;
            att: number;
            def: number;
            attspd: number;
            dmg: number;
            armr: number;
            regen: number;
        }
    ) {
        super(ctx, pos);
        this.id = id;
        this.name = name;
        this.iconImage.src = icon; 
        this.stats = stats;
        this.healthBar = new HealthBar(ctx, {x: pos.x + Combatant.healthBarOffset.x, y: pos.y + Combatant.healthBarOffset.y});
        this.sprite = new Sprite(ctx, {x: pos.x, y: pos.y}, sprite);
        //this.graveyard = new Graveyard(ctx, {x: pos.x, y: pos.y});
    }
    toString() {
        return this.name;
    }
    public setOpponent(opponent: Combatant | null) {
        this.opponent = opponent;
    }
    public tick(timeDelta: number) {
        if (this.opponent) {
            this.attCD = this.attCD + timeDelta;
            if (this.attCD >= this.stats.attspd) {
                this.toHit();
                this.attCD = this.attCD - this.stats.attspd;
            }
            if (this.dmgChk == true) {
                this.dmgRoll();
                this.dmgChk = false;
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
        this.ctx.fillText(this.name, this.pos.x+40, this.pos.y+140);
        this.ctx.drawImage(this.iconImage, this.pos.x, this.pos.y+120)
        this.ctx.fillStyle = 'black';
        this.ctx.fillText("DMG: "+String(this.stats.dmg), this.pos.x, this.pos.y+170);
        this.healthBar.draw();
        this.sprite.draw();
        this.graveyard.draw();
    }
    public donate(amount: number) {
        this.stats.att = this.stats.att + amount;
        this.stats.def = this.stats.att + amount;
        this.stats.hp = this.stats.hp + amount;
        this.healthBar.setHealth(this.stats.hp)
    }
    public getID() {
        return this.id;
    }
    public getIcon() {
        return this.iconImage;
    }
    public setPosition(pos: {x: number, y: number}) {
        this.pos = pos;
        this.healthBar.setPosition({x: pos.x + Combatant.healthBarOffset.x, y: pos.y + Combatant.healthBarOffset.y});
        this.sprite.setPosition(this.pos);
    }
    protected toHit() {
        let total:      number;
        let roll:       number;
        if (this.opponent == null)
            return;
        total = this.stats.att + this.opponent.stats.def;
        roll = Math.ceil(Math.random() * total);
        if (roll <= this.stats.att){
            console.log(this.name + " " + this.id + " Has hit! =D")
            this.dmgChk = true;
        }
        if (roll > this.stats.att){
            console.log(this.name + " " + this.id + " Missed the attack! Yikes!!! >_<")
        }
        return;
    }
    protected dmgRoll() {
        let damage:      number;
        if (this.opponent == null)
            return;
        damage = this.stats.dmg - this.opponent.stats.armr;
        if (damage > 0) {
            this.opponent.stats.hp = this.opponent.stats.hp - damage;
            this.opponent.healthBar.setHealth(this.opponent.stats.hp);
            this.opponent.healthBar.draw()
            this.opponent.sprite.shake();
            console.log(this.opponent.name + " " + this.opponent.id + " Has taken " +damage + "! :(");
        }
        if (this.opponent.stats.hp <= 0) {
            this.opponent.stats.hp = 0;
            this.opponent.healthBar.setHealth(0);
            this.opponent.healthBar.draw()
            console.log(this. opponent.name + " " + this.opponent.id + " Has been slain! Their body lies motionless on the floor... ;-;")
        }
    }
    public isDead() {
        if (this.stats.hp <= 0)
            return true;
        return false;
    }
}

class HealthBar extends Actor {
    private targetHealth: number = 1000;
    private displayedYellow: number = 1000;
    

    private static yellowBarFollowRate: number = 7; //per millesecond
    private static healthToPixels: number = 15; //health units per pixel
    private static height: number = 6; //health bar height

    public draw() {
       
        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(this.pos.x, this.pos.y, 1000 / HealthBar.healthToPixels, HealthBar.height);
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
            this.pos.y + 20
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

export class Graveyard extends Actor{
    //private graveyardowner: number;
    private graveyardqueue: Combatant.Combatant[] = [];

   // constructor(ctx: CanvasRenderingContext2D,  pos: {x: number, y: number}, graveyardid: number) {
   //     super(ctx ,pos);
    //this.graveyardowner = graveyardid;
   // }
  
    public addloser(champ: Combatant.Combatant) {
        this.graveyardqueue.push(champ);
    }
    public newqueue(champ: Combatant.Combatant) {
        this.graveyardqueue = [];
        this.graveyardqueue.push(champ);
    }
    public clearqueue() {
        this.graveyardqueue = [];
    }
    public draw(){
        for(let i = 0; i < this.graveyardqueue.length; i++)
            this.ctx.drawImage(this.graveyardqueue[i].getIcon(), 0, 0+20*i);
    }

    public tick(){

    }
}

}
