function findChamp(champs: Champion[], id: number) {
    for (let i = 0; i < champs.length; i++) {
        if (champs[i].id == id)
            return champs[i];
    }
    return null;
}

class GameTemplate {
    challenger: Champion | null = null;
    champion: Champion | null = null;
    queue: Champion[] = [];
}

class Champion {
    id: number;
    name: string;
    status: Stats;
    constructor(id: number, name: string, status: Stats) {
        this.id = id;
        this.name = name;
        this.status = status
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
