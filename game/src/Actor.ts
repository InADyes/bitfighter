//interface
abstract class Actor {
    protected ctx: CanvasRenderingContext2D;
    protected pos: {x: number, y: number};
    protected abstract draw(): void;
    public abstract tick(timeDelta: number): void;
    constructor(ctx: CanvasRenderingContext2D, pos: {x: number, y: number}) {
        this.ctx = ctx;
        this.pos = pos;
    }
}

