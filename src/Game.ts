/// <reference path="GameTemplate.ts" />

//this is real aweful
function animateHealth(canvas: HTMLCanvasElement, champ: Champion, hpChange: number, x: number, y: number, game: Game) {
    console.log("todo: animate health");
    let ctx = canvas.getContext("2d");
    if (ctx == null) {
        console.error("why is ctx null, wtf");
        return;
    } 
    if (hpChange > 0)
        animatePositive(ctx, champ, hpChange, x, y);
    else
        animateNegative(ctx, champ, -1 * hpChange, x, y, game);
}

function animateNegative(ctx: CanvasRenderingContext2D, champ: Champion, hpChange: number, x: number, y: number, game: Game) {
    champ.status.health -= 1;
    hpChange--;
    drawHP(ctx, champ.status.health, x, y);
    if (hpChange > 0 && champ.status.health > 0)
        window.requestAnimationFrame(animateNegative.bind(null, ctx, champ, hpChange, x, y, game));
    else
        window.setTimeout(game.checkDeath.bind(game), 1000);
}

function animatePositive(ctx: CanvasRenderingContext2D, champ: Champion, hpChange: number, x: number, y: number) {
    console.log("hpchange: ", hpChange);
    champ.status.health += 1;
    hpChange++;
    drawHP(ctx, champ.status.health, x, y);
    if (hpChange > 0 && champ.status.health < 100)
        window.requestAnimationFrame(animatePositive.bind(null, ctx, champ, hpChange, x, y));
}

function drawHP(ctx: CanvasRenderingContext2D, hp: number, x: number, y: number) {
    ctx.clearRect(x - 3, y - 3, 104, 9);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.moveTo(x, y);
    ctx.lineTo(x + hp, y);
    ctx.stroke();
}

let spriteArt = [
    'images/animation/champion_alpha.png',
    'images/animation/Axe/Axe.png',
    'images/animation/Katana/Katana.png',
    'images/animation/Orc/Orc.png',
    'images/animation/Wizard/Wizard.png'
];

let iconArt = [
    'images/icons/cherries.png',
    'images/icons/banana.png',
    'images/icons/lime-icon.png',
    'images/icons/orange-icon.png'
];

class Game extends GameTemplate {
    //either moves somone from the queue to the arena or ticks the arena
    tick() {
        //all game timing goes here
        if (this.champion && this.challenger) {
            this.tickFight();
        } else {
            window.setTimeout(this.newChallenger.bind(this), 1500);
            window.setTimeout(this.tick.bind(this), 3000);
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
            animateHealth(this.canvas, this.challenger, -35, 160, 150, this);
            //this.challenger.status.health -= 35;
        } else {
            animateHealth(this.canvas, this.champion, -35, 40, 150, this);
            //this.champion.status.health -= 35;
        }
    }
    checkDeath() {
        if (this.champion) {
            console.log(`champion health: ${this.champion.status.health}`);
            if (this.champion.status.health <= 0) {
                this.graveyard.push(this.champion);
                this.champion = null;
            }
        }
        if (this.challenger) {
            console.log(`challenger health: ${this.challenger.status.health}`);
            if (this.challenger.status.health <= 0) {
                this.graveyard.push(this.challenger);
                this.challenger = null;
            }
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
        tickCanvas(this, this.canvas);
        //post battle heal
        if (this.champion && this.challenger == null) {
            window.setTimeout(this.healChampion.bind(this), 2000);
        }
        window.setTimeout(this.tick.bind(this), 4000);
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
        animateHealth(this.canvas, this.champion, this.champion.status.heal, 40, 150, this);
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
                iconArt[Math.floor((iconArt.length * Math.random()))],
                {
                    health: 100,
                    power: donation.amount,
                    heal: 30
                },
                spriteArt[(donation.art - 1) % 5]
            ));
        }
        
    }
    message(message: {id: number, name: string, message: string}) {
        console.log(`${name} message says: ${message}`);
    }
}
