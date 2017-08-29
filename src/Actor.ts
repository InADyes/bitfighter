//interface
class Actor {
    protected draw(vector: {x: number, y: number}) {
        console.log(this, "^ this is missing draw overload");
    }
    public tick(timeDelta: number) {
        console.log(this, "^ this is missing tick overload");
    }
}

