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
    private oponent: Champion | null;
    constructor(
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
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.art = art;
        this.stats = stats;
    }
    toString() {
        return this.name;
    }
    public setOpponent(opponent: Champion | null) {
    }
    
    public tick(timeDelta: number) {

    }
    protected draw(vector: {x: number, y: number}) {

    }
}

}
