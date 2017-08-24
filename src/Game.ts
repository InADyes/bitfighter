/// <reference path="GameTemplate.ts" />

class Game extends GameTemplate {
    //either moves somone from the queue to the arena or ticks the arena
    tick() {
        //all game timing goes here
        if (this.champion && this.challenger) {
            this.tickFight();
            window.setTimeout(this.tick.bind(this), 2000);
        } else {
            window.setTimeout(this.newChallenger.bind(this), 4000);
            window.setTimeout(this.tick.bind(this), 6000);
        }
    }
    tickFight() {
        //fight logic to go here
        if (this.champion == null || this.challenger == null) {
            console.log("tickFight: missing champion(s)")
            return;
        }

        console.log("fight tick");
        //needs to be cleaned up and stuff
        let challengerRoll = Math.random() * this.champion.status.power;
        let championRoll =  Math.random() * this.challenger.status.power;
        if (challengerRoll > championRoll) {

        }

        console.log(`champion health: ${this.champion.status.health}`);
        console.log(`challenger health: ${this.challenger.status.health}`);
        if (this.challenger.status.health <= 0) {
            this.graveyard.push(this.challenger);
            this.challenger = null;
        }
        if (this.champion.status.health <= 0) {
            this.graveyard.push(this.champion);
            this.champion = null;
        }
        if (this.champion == null && this.challenger) {
            this.champion = this.challenger;
            this.challenger = null;
        }
    }
    newChallenger() {
        let champ = this.queue.pop();

        if (champ == undefined) {
            console.log("no champions in queue");
            return;
        }

        if (this.champion == null)
            this.champion = champ;
        else
            this.challenger = champ;
        console.log("new challenger");
        console.log(this);
    }
    donate(donation: {id: number, name: string, amount: number}) {
        let champ: Champion | null;
    
        if (this.champion != null && this.champion.id == donation.id) {
            //chapion donation
            this.champion.status.power += donation.amount;
            this.champion.status.health += donation.amount;
        } else if (this.challenger != null && this.challenger.id == donation.id) {
            //challenger donation
            this.challenger.status.power += donation.amount;
            this.challenger.status.power += donation.amount;
        } else if ((champ = this.searchQueue(donation.id)) != null) {
            //queue donation
            champ.status.power += donation.amount;
        } else {
            //no current champion donation (new champion)
            this.queue.push(new Champion(
                donation.id,
                donation.name,
                "images/icon.png",
                {
                    health: 100,
                    power: donation.amount,
                    heal: 30
                }
            ));
        }
    }
    message(message: {id: number, name: string, message: string}) {
        console.log(`${name} message says: ${message}`);
    }
}
