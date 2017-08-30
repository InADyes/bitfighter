namespace Combatant {

export class Combatant extends Actor{
    private id: number;
    private name: string;
    private icon: string;
    private spriteUrl: string;
    private spriteImage = new Image();
    private attCD: number;
    private dmgChk: boolean;
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
        this.healthBar = new HealthBar(ctx, {x: pos.x, y: pos.y + 100});
    }
    toString() {
        return this.name;
    }
    public setOpponent(opponent: Combatant | null) {
        this.opponent = opponent;
    }
    public tick(timeDelta: number) {
        this.attCD = this.attCD + timeDelta;
        if (this.attCD >= this.stats.attspd){
            this.toHit();
            this.attCD = this.attCD - this.stats.attspd;
        }
        if (this.dmgChk == true){
            this.dmgRoll();
            this.dmgChk = false;
        }
        this.draw();
        this.healthBar.tick(timeDelta);
    }
    protected draw() {
        this.ctx.drawImage(this.spriteImage, this.pos.x, this.pos.y);
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
        this.healthBar.setPosition({x: pos.x, y: pos.y + 100});
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
    private static healthToPixels: number = 10; //health units per pixel
    private static height: number = 5; //health bar height

    protected draw() {
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
