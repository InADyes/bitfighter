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
