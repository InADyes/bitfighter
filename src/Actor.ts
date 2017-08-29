//interface
abstract class Actor {
    protected abstract draw(vector: {x: number, y: number}): void;
    public abstract tick(timeDelta: number): void;
}

