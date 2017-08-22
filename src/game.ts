/// <reference path="logic.ts" />

namespace Game {

type newChallengerFunc = (canvas: HTMLCanvasElement, id: number, name: string, bits: number) => Champion;
type newFightFunc = (canvas: HTMLCanvasElement, queue: Champion[]) => Champion | null;
type newTickFunc = (canvas: HTMLCanvasElement, chamption: Champion, challenger: Champion) => void;

export class Game {
    canvas: HTMLCanvasElement;
    challenger: Champion | null;
    champion: Champion | null;
    queue: Champion[] = [];
    handleNewChallenger: newChallengerFunc;
    handleNewFight: newFightFunc;
    handleTickFight: newTickFunc;
    constructor(
        canvas: HTMLCanvasElement,
        handleNewChallenger: newChallengerFunc,
        handleNewFight: newFightFunc,
        handleTickFight: newTickFunc) {
        this.canvas = canvas;
        this.handleNewChallenger = handleNewChallenger;
        this.handleNewFight = handleNewFight;
        this.handleTickFight = handleTickFight;
    }
    newDonation(id: number, name: string, bits: number) {
        if (false) {

        } else {
            let challenger = this.handleNewChallenger(this.canvas, id, name, bits);
            this.queue.push(challenger);
        }

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
        } else {
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
    id: number;
    name: string;
    status: Logic.Stats;
    constructor(id: number, name: string, status: Logic.Stats) {
        this.id = id;
        this.name = name;
        this.status = status
    }
    toString() {
        return this.name;
    }
}

}
