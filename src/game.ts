/// <reference path="logic.ts" />

namespace Game {

export class Game {
    canvas: HTMLCanvasElement;
    challenger: Champion | null;
    champion: Champion | null;
    queue: Champion[] = [];
    handleNewChallenger: (canvas: HTMLCanvasElement, challenger: Champion) => void;
    handleNewFight: (canvas: HTMLCanvasElement, queue: Champion[]) => Champion | null;
    handleTickFight: (canvas: HTMLCanvasElement, chamption: Champion, challenger: Champion) => void;
    constructor(
        canvas: HTMLCanvasElement,
        handleNewChallenger: (canvas: HTMLCanvasElement, challenger: Champion) => void,
        handleNewFight: (canvas: HTMLCanvasElement, queue: Champion[]) => Champion | null,
        handleTickFight: (canvas: HTMLCanvasElement, chamption: Champion, challenger: Champion) => void) {
        this.canvas = canvas;
        this.handleNewChallenger = handleNewChallenger;
        this.handleNewFight = handleNewFight;
        this.handleTickFight = handleTickFight;
    }
    newChallenger(challenger: Champion) {
        this.handleNewChallenger(this.canvas, challenger);
        this.queue.push(challenger);
    }
    newFight() {
        if (this.challenger != null) {
            console.error(`new fight error, challenger already exists: ${this.challenger}`)
            return;
        }
        let challenger = this.handleNewFight(this.canvas, this.queue)
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
        this.handleTickFight(this.canvas, this.champion, this.challenger);
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
