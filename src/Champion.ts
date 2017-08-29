class Champion {
    id: number;
    private name: string;
    get name() {
        return this.name;
    }
    private icon: string;
    private art: string;
    private hp: number;
    private power: number;
    private heal: number;
    constructor(id: number, name: string, icon: string, status: Stats, art: string) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.icon = icon;
        this.art = art;
    }
    toString() {
        return this.name;
    }
    reduceHp(hp: number){
        this.hp += hp;
        if (hp > 100)
            this.hp = 100;
        else if (hp < 0)
            this.hp = 100;
    }
    gethp() {
        return this.hp;
    }
}
