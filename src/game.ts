/// <reference path="logic.ts" />

namespace Game {

export class Game {
    challenger: Champion | null;
    champion: Champion | null;
    queue: Champion[] = [];
    handleNewChallenger: (challenger: Champion) => void;
    handleNewFight: (queue: Champion[]) => Champion | null;
    handleTickFight: (chamption: Champion, challenger: Champion) => void;
    constructor(
        handleNewChallenger: (challenger: Champion) => void,
        handleNewFight: (queue: Champion[]) => Champion | null,
        handleTickFight: (chamption: Champion, challenger: Champion) => void) {
            this.handleNewChallenger = handleNewChallenger;
            this.handleNewFight = handleNewFight;
            this.handleTickFight = handleTickFight;
        }
    newChallenger(challenger: Champion) {
        this.handleNewChallenger(challenger);
        this.queue.push(challenger);
    }
    newFight() {
        if (this.challenger != null) {
            console.error(`new fight error, challenger already exists: ${this.challenger}`)
            return;
        }
        let challenger = this.handleNewFight(this.queue)
        if (challenger == null) {
            console.error("no challenger picked");
            return ;
        }
        if (this.champion != null) {
            this.challenger = challenger;
            console.log(`new fight: ${this.champion} & ${this.challenger}`)
        }
        else {
            console.log("no champion, challener becomes champion");
            this.champion = challenger;
        }

    }
    tickFight() {
        if (this.challenger == null) {
            console.error("cannot tick fight, missing challenger");
            return ;
        }
        if (this.champion == null) {
            console.error("cannot tick fight, missing champion");
            return ;
        }
        this.handleTickFight(this.champion, this.challenger);
    }
}

export class Champion {
    name: string;
    status: Logic.Stats;
    constructor(name: string, status: Logic.Stats) {
        this.name = name;
        this.status = status
    }
    toString() {
        return this.name;
    }
}

}
