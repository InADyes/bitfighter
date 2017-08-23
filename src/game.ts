/// <reference path="logic.ts" />

namespace Game {

type newDonationFunc = (canvas: HTMLCanvasElement, id: number, name: string, bits: number) => Champion;
type newFightFunc = (canvas: HTMLCanvasElement, queue: Champion[]) => Champion | null;
type newTickFunc = (canvas: HTMLCanvasElement, chamption: Champion, challenger: Champion) => void;
type additionalDonationFunc = (canvas: HTMLCanvasElement, champion: Champion, bits: number) => void;

function findChamp(champs: Champion[], id: number) {
    for (let i = 0; i < champs.length; i++) {
        if (champs[i].id == id)
            return champs[i];
    }
    return null;
}

export class Game {
    canvas: HTMLCanvasElement;
    challenger: Champion | null;
    champion: Champion | null;
    queue: Champion[] = [];
    handleNewDonation: newDonationFunc;
    handleLineDonation: additionalDonationFunc;
    handleBattleDonation: additionalDonationFunc;
    handleNewFight: newFightFunc;
    handleTickFight: newTickFunc;
    constructor(
        canvas: HTMLCanvasElement,
        handleNewDonation: newDonationFunc,
        handleLineDonation: additionalDonationFunc,
        handleBattleDonation: additionalDonationFunc,
        handleNewFight: newFightFunc,
        handleTickFight: newTickFunc) {
        this.canvas = canvas;
        this.handleNewDonation = handleNewDonation;
        this.handleLineDonation = handleLineDonation;
        this.handleBattleDonation = handleBattleDonation;
        this.handleNewFight = handleNewFight;
        this.handleTickFight = handleTickFight;
    }
    newDonation(id: number, name: string, bits: number) {
        let champ: Champion | null;
    
        if (this.champion != null && this.champion.id == id) {
            this.handleBattleDonation(this.canvas, this.champion, bits);
        } else if (this.challenger != null && this.challenger.id == id) {
            this.handleBattleDonation(this.canvas, this.challenger, bits);
        } else if ((champ = findChamp(this.queue, id)) != null) {
            this.handleLineDonation(this.canvas, champ, bits);
        } else {
            let challenger = this.handleNewDonation(this.canvas, id, name, bits);
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
