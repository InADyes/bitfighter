class Game extends GameTemplate {
    donation(donation: {id: number, name: string, amount: number}) {

    }
    message(message: {id: number, name: string, message: string}) {
        
    }
}



    

    export function handleNewChallenger(canvas: HTMLCanvasElement, id: number, name: string, bits: number) {
        let challenger = new Game.Champion(id, name, {health: bits})
    
        console.log(`new challenger: ${challenger}`);
        console.log(challenger);
        return challenger;
    }
    export function handleNewFight(canvas: HTMLCanvasElement, queue: Game.Champion[]) {
        let champion = queue.pop();
        if (champion == undefined)
            return null;
        return champion;
    }
    export function handleTickFight(canvas: HTMLCanvasElement, champion: Game.Champion, challenger: Game.Champion) {
        console.log("fight tick");
    }
    export function boostChamp(canvas: HTMLCanvasElement, champ: Game.Champion, bits: number) {
        console.log(`increasing ${champ}'s health by ${bits}`);
        champ.status.health += bits;
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
}
