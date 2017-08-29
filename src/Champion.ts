namespace Champion {

export class Champion extends Actor{
    id: number;
    private name: string;
    private icon: string;
    private art: string;
    private hp: number;
    private power: number;
    private regeneration: number;
    private oponent: Champion | null;
    constructor(
        id: number,
        name: string,
        icon: string,
        art: string,
        hp: number,
        power: number,
        regeneration: number
    ) {
        super();
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.art = art;
        this.hp = hp;
        this.power = power;
        this.regeneration = regeneration;
    }
    toString() {
        return this.name;
    }
    setOpponent(opponent: Champion | null) {
    }
    
    public tick(timeDelta: number) {

    }
    protected draw(vector: {x: number, y: number}) {

    }
}

}
