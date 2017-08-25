/// <reference path="GameTemplate.ts" />

//this is real aweful
function animateHealth(canvas: HTMLCanvasElement, champ: Champion, hpChange: number, x: number, y: number) {
    console.log("todo: animate health");
    let ctx = canvas.getContext("2d");
    if (ctx == null) {
        console.error("why is ctx null, wtf");
        return;
    } 
    if (hpChange > 0)
        animatePositive(ctx, champ, hpChange, x, y);
    else
        animateNegative(ctx, champ, -1 * hpChange, x, y);
}

function animateNegative(ctx: CanvasRenderingContext2D, champ: Champion, hpChange: number, x: number, y: number) {
    champ.status.health -= 1;
    drawHP(ctx, champ.status.health, x, y);
    hpChange--;
    if (hpChange > 0)
        window.requestAnimationFrame(animateNegative.bind(null, ctx, champ, hpChange, x, y));
}

function animatePositive(ctx: CanvasRenderingContext2D, champ: Champion, hpChange: number, x: number, y: number) {
    champ.status.health += 1;
    drawHP(ctx, champ.status.health, x, y);
    hpChange--;
    if (hpChange > 0)
    window.requestAnimationFrame(animateNegative.bind(null, ctx, champ, hpChange, x, y));
}

function drawHP(ctx: CanvasRenderingContext2D, hp: number, x: number, y: number) {
    ctx.clearRect(0, 0, 100, 5);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.moveTo(x, y);
    ctx.lineTo(x + hp, y);
    ctx.stroke();
}

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
        console.log("new render:");
        console.log(this);
        tickCanvas(this, this.canvas);
    }
    tickFight() {
        //fight logic to go here
        if (this.champion == null || this.challenger == null) {
            console.log("tickFight: missing champion(s)")
            return;
        }

        console.log("fight tick");
        //needs to be cleaned up and stuff
        if (this.champion.status.power / (this.champion.status.power + this.challenger.status.power) >= Math.random() ) {
            animateHealth(this.canvas, this.challenger, -35, 0, 0);
            //this.challenger.status.health -= 35;
        } else {
            animateHealth(this.canvas, this.challenger, -35, 0, 10);
            //this.champion.status.health -= 35;
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

            //set the graveyard
            let champ = this.graveyard.pop();
            this.graveyard = [];
            if (champ)
                this.graveyard.push(champ);
        }
        //post battle heal
        if (this.champion && this.challenger == null) {
            window.setTimeout(this.healChampion.bind(this), 2000);
        }
    }
    newChallenger() {
        let champ = this.queue.shift();

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
        tickCanvas(this, this.canvas);
    }
    healChampion() {
        if (this.champion == null)
            return;
        this.champion.status.health += this.champion.status.heal;
        if (this.champion.status.health > 100)
            this.champion.status.health = 100;
    }
    donate(donation: {id: number, name: string, amount: number, art: number}) {
        let champ: Champion | null;
    
        if (this.champion != null && this.champion.id == donation.id) {
            //chapion donation
            this.champion.status.power += donation.amount;
            this.champion.status.health += donation.amount;
            if (this.champion.status.health > 100)
                this.champion.status.health = 100;
            tickCanvas(this, this.canvas);
        } else if (this.challenger != null && this.challenger.id == donation.id) {
            //challenger donation
            this.challenger.status.power += donation.amount;
            this.challenger.status.health += donation.amount;
            if (this.challenger.status.health > 100)
                this.challenger.status.health = 100;
            tickCanvas(this, this.canvas);
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
