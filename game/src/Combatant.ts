namespace Combatant {

export class Combatant extends Actor{
    private id: number;
    private name: string;
    private icon: string;
    private spriteUrl: string;
    private spriteImage = new Image();
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
        this.icon = icon;
        this.spriteUrl = sprite;
        this.spriteImage.src = this.spriteUrl;
        this.stats = stats;
        this.healthBar = new HealthBar(ctx, {x: pos.x + Combatant.healthBarOffset.x, y: pos.y + Combatant.healthBarOffset.y});
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
            if (this.attCD >= this.stats.attspd){
                this.toHit();
                this.attCD = this.attCD - this.stats.attspd;
            }
            if (this.dmgChk == true){
                this.dmgRoll();
                this.dmgChk = false;
            }
        }
        else
            this.attCD = 0;
        this.healthBar.tick(timeDelta);
    }
    public draw() {
        this.ctx.drawImage(this.spriteImage, this.pos.x, this.pos.y);
        this.healthBar.draw();
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
    public setPosition(pos: {x: number, y: number}) {
        this.pos = pos;
        this.healthBar.setPosition({x: pos.x + Combatant.healthBarOffset.x, y: pos.y + Combatant.healthBarOffset.y});
    }
    protected toHit(){
        let total:      number;
        let roll:       number;
        if (this.opponent == null)
            return;
        total = this.stats.att + this.opponent.stats.def;
        roll = Math.ceil(Math.random() * total);
        if (roll <= this.stats.att)
            this.dmgChk = true;
        return;
    }
    protected dmgRoll(){
        let damage:      number;
        if (this.opponent == null)
            return;
        damage = this.stats.dmg - this.opponent.stats.armr;
        if (damage > 0){
            this.opponent.stats.hp = this.opponent.stats.hp - damage;
            this.opponent.healthBar.setHealth(this.opponent.stats.hp);
        }
        if (this.opponent.stats.hp <= 0){
            this.opponent.stats.hp = 0;
            this.opponent.healthBar.setHealth(0);
        }
    }
    public isDead(){
        if (this.stats.hp <= 0)
            return true;
        return false;
    }
}

class HealthBar extends Actor {
    private targetHealth: number = 1000;
    private displayedYellow: number = 1000;

    private static yellowBarFollowRate: number = 3000; //per millesecond
    private static healthToPixels: number = 15; //health units per pixel
    private static height: number = 5; //health bar height

    public draw() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.displayedYellow / HealthBar.healthToPixels), HealthBar.height);
        this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.targetHealth / HealthBar.healthToPixels), HealthBar.height);
    }
    public tick(timeDelta: number) {
        if (this.targetHealth < this.displayedYellow) {
            this.displayedYellow -= timeDelta / HealthBar.yellowBarFollowRate;
            if (this.targetHealth > this.displayedYellow)
                this.displayedYellow = this.targetHealth;
        }
        this.draw();
    }
    public setHealth(health: number) {
        this.targetHealth = health;
    }
}

}