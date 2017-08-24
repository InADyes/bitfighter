/// <reference path="GameTemplate.ts" />

class Game extends GameTemplate {
    //either moves somone from the queue to the arena or ticks the arena
    tick() {
        //all game timing goes here
        if (this.champion && this.challenger) {
            this.tickFight();
            window.setTimeout(this.tick.bind(this), 3000);
        } else {
            window.setTimeout(this.newChallenger.bind(this), 9000);
            window.setTimeout(this.tick.bind(this), 12000);
        }
    }
    tickFight() {
        console.log("fight tick");
        //fight logic to go here
    }
    newChallenger() {
        // if (this.queue == undefined) {
        //     console.log("no champions in queue");
        //     return;
        // }

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
        } else if (this.challenger != null && this.challenger.id == donation.id) {
            //challenger donation
            this.challenger.status.power += donation.amount;
        } else if ((champ = this.searchQueue(donation.id)) != null) {
            //queue donation
            champ.status.power += donation.amount;
        } else {
            //no current champion donation (new champion)
            this.queue.push(new Champion(
                donation.id,
                donation.name,
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
