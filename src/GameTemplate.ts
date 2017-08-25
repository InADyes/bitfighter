class GameTemplate {
    challenger: Champion | null = null;
    champion: Champion | null = null;
    queue: Champion[] = [];
    graveyard: Champion[] = [];
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    searchQueue(id: number) {
        for (let champ of this.queue) {
            if (champ.id == id)
                return champ;
        }
        return null;
    }
}

class Champion {
    id: number;
    name: string;
    status: Stats;
    icon: string;
    art: string;
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
}

interface Stats {
    health: number;
    power: number;
    heal: number;
}
