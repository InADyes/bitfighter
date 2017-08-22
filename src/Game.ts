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
        console.log(`new fight: ${challenger}\n`)
        if (this.champion != null)
            this.challenger = challenger;
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

        this.handleTickFight(this.champion, this.challenger); //todo: how does this set stuff to null?
    }
}

export class Champion {
    name: string;
    status: Status;
    constructor(name: string, status: Status) {
        this.name = name;
        this.status = status
    }
    toString() {
        return this.name;
    }
}

export interface Status {
    health: number;
}

}
