namespace Champion {

export class Champion extends Actor{
    private id: number;
    private name: string;
    private icon: string;
    private sprite: string;
    private stats: {
            hp: number;
            att: number;
            def: number;
            as: number;
            dmg: number;
            armr: number;
            rgn: number;
    };
    private healthBar: HealthBar;
    private opponent: Champion | null;
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
            rgn: number;
        }
    ) {
        super(ctx, pos);
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.sprite = sprite;
        this.stats = stats;
        this.healthBar = new HealthBar(ctx, {x: 0, y: 0});
    }
    toString() {
        return this.name;
    }
    public setOpponent(opponent: Champion | null) {
        this.opponent = opponent;
    }
    public tick(timeDelta: number) {
        this.draw();
        this.healthBar.tick(timeDelta);
    }
    protected draw() {
    }
    public donate(amount: number) {
    }
    public getID() {
        return this.id;
    }
    public setPosition(pos: {x: number, y: number}) {
        this.pos = pos;
    }
}

class HealthBar extends Actor {
    private targetHealth: number;
    private displayedYellow: number;
    constructor(ctx: CanvasRenderingContext2D, pos: {x: number, y: number}) {
        super(ctx, pos);
        this.targetHealth = 1000;
        this.displayedYellow = 1000;
    }
    protected draw() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.displayedYellow / 10), 5);
        this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.targetHealth / 10), 5);
    }
    public tick(timeDelta: number) {
        if (this.targetHealth < this.displayedYellow) {
            this.displayedYellow -= timeDelta * 3000000;
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
