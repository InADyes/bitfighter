namespace Champion {

export class Champion extends Actor{
    private ctx: CanvasRenderingContext2D;
    private pos: {x: number, y: number};
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
        super();
        this.ctx = ctx;
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

    }
    protected draw(vector: {x: number, y: number}) {

    }
}

class HealthBar extends Actor {
    private ctx: CanvasRenderingContext2D;
    private pos: {x: number, y: number};
    private targetHealth: number;
    private displayedRed: number;
    private displayedYellow: number;
    constructor(ctx: CanvasRenderingContext2D, pos: {x: number, y: number}) {
        super();
        this.ctx = ctx;
        this.pos = pos;
        this.targetHealth = 1000;
        this.displayedRed = 1000;
        this.displayedYellow = 1000;
    }
    protected draw(vector: {x: number, y: number}) {
    }
    public tick(timeDelta: number) {
    }
}

}
