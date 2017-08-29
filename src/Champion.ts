namespace Champion {

export class Champion extends Actor{
    private id: number;
    private name: string;
    private icon: string;
    private art: string;
    private stats: {
        hp: number;
        power: number;
        regeneration: number;
    };
    private healthBar: HealthBar;
    private opponent: Champion | null;
    constructor(
        ctx: CanvasRenderingContext2D,
        pos: {x: number, y: number},
        id: number,
        name: string,
        icon: string,
        art: string,
        stats: {
            hp: number;
            power: number;
            regeneration: number;
        }
    ) {
        super(ctx, pos);
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.art = art;
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
    }
    public tick(timeDelta: number) {
        this.draw();
    }
    public setHealth(health: number) {
        this.targetHealth = health;
    }
}

}
