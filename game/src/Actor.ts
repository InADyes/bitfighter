abstract class Actor {
    protected ctx: CanvasRenderingContext2D;
    protected pos: {x: number, y: number};
    public abstract draw(): void;
    public abstract tick(timeDelta: number): void;
    public setPosition(pos: {x: number, y: number}) {
        this.pos = pos;
    }
    constructor(ctx: CanvasRenderingContext2D, pos: {x: number, y: number}) {
        this.ctx = ctx;
        this.pos = pos;
    }
}

