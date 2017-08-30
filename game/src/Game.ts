/// <reference path='Actor.ts' />
/// <reference path='Combatant.ts' />

namespace Game {

// function animateHealth(canvas: HTMLCanvasElement, champ: Combatant, hpChange: number, x: number, y: number, game: Game) {
//     console.log("todo: animate health");
//     let ctx = canvas.getContext("2d");
//     if (ctx == null) {
//         console.error("why is ctx null, wtf");
//         return;
//     } 
//     if (hpChange > 0)
//         animatePositive(ctx, champ, hpChange, x, y);
//     else
//         animateNegative(ctx, champ, -1 * hpChange, x, y, game);
// }

// function animateNegative(ctx: CanvasRenderingContext2D, champ: Combatant, hpChange: number, x: number, y: number, game: Game) {
//     champ.health -= 1;
//     hpChange--;
//     ctx.clearRect(x,y-120, x+75, y-50);
//     var chamshake = new Image();
    
//     chamshake.src = champ.art;\

//     if(hpChange%2 != 0)
//         ctx.drawImage(chamshake, x+15,y-120,100,100);
//     else
//         ctx.drawImage(chamshake, x+20,y-120,100,100);
//     //ctx.drawImage()
//     drawHP(ctx, champ.health, x, y);
//     if (hpChange > 0 && champ.health > 0)
//         window.requestAnimationFrame(animateNegative.bind(null, ctx, champ, hpChange, x, y, game));
//     else
//         window.setTimeout(game.checkDeath.bind(game), 1000);
// }

// function animatePositive(ctx: CanvasRenderingContext2D, champ: Combatant, hpChange: number, x: number, y: number) {
//     console.log("hpchange: ", hpChange);
//     champ.health += 1;
//     hpChange++;
//     drawHP(ctx, champ.health, x, y);
//     if (hpChange > 0 && champ.health < 100)
//         window.requestAnimationFrame(animatePositive.bind(null, ctx, champ, hpChange, x, y));
// }

// function drawHP(ctx: CanvasRenderingContext2D, hp: number, x: number, y: number) {
//     ctx.clearRect(x - 3, y - 3, 104, 9);
//     ctx.beginPath();
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 5;
//     ctx.moveTo(x, y);
//     ctx.lineTo(x + hp, y);
//     ctx.stroke();
// }

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



export class Game {
    private challenger: Combatant.Combatant | null = null;
    private champion: Combatant.Combatant | null = null;
    private queue: Combatant.Combatant[] = [];
    private graveyard: Combatant.Combatant[] = [];
    private frontCtx: CanvasRenderingContext2D;
    private backCtx: CanvasRenderingContext2D;
    private canvasSize: {x: number, y: number};
    private lastTimestamp: number = performance.now();

    private static fightTimeout: number = 3000; // how long between fights in milliseconds
    private checkQueue: number = Game.fightTimeout; // countdown for starting a new fight
    private static championLocation = {x: 10, y: 10};
    private static challengerLocation = {x: 100, y: 10};

    constructor(front: HTMLCanvasElement, back: HTMLCanvasElement) {
        let frontCtx = front.getContext('2d');
        let backCtx = front.getContext('2d');
        if (frontCtx == null || backCtx == null) {
            console.error("could not get get canvas 2d context");
            return;
        }

        this.frontCtx = frontCtx;
        this.backCtx = backCtx;
        this.canvasSize = {x: front.width, y: front.height};
    }

    private searchQueue(id: number) {
        for (let champ of this.queue) {
            if (champ.getID() == id)
                return champ;
        }
        return null;
    }
    //either moves somone from the queue to the arena or ticks the arena
    public tick(timeDelta: number) {
        //console.log('timedelta:', timeDelta);
        this.checkDeath();
        this.frontCtx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        if (this.champion) {
            this.champion.tick(timeDelta);
            this.champion.draw();
        }

        if (this.challenger) {
            this.challenger.tick(timeDelta);
            this.challenger.draw();
        }
        else {
            if (this.checkQueue <= 0) {
                this.newChallenger();
            } else {
                this.checkQueue -= timeDelta;
            }
        }
        window.requestAnimationFrame((timestamp) => {
            let delta = timestamp - this.lastTimestamp;
            this.lastTimestamp = timestamp;
            this.tick(delta);
        });
    }
    checkDeath() {
        if (this.challenger && this.challenger.isDead()) {
            this.graveyard.push(this.challenger);
            this.challenger = null;
            this.updateOpponants();
        }
        if (this.champion && this.champion.isDead()) {
            if (this.challenger) {
                this.graveyard = [this.champion];
                this.champion = this.challenger;
                this.challenger = null;
                this.updateOpponants();
            } else {
                this.graveyard = [];
                this.champion = null;
            }
        }
    }
    newChallenger() {
        let champ = this.queue.shift();

        if (champ == undefined) {
            console.log("no Combatants in queue");
            return;
        }

        if (this.champion == null) {
            champ.setPosition(Game.championLocation);
            this.champion = champ;
        } else {
            this.challenger = champ;
            this.updateOpponants();
        }
        this.checkQueue = Game.fightTimeout;
        console.log("new challenger");
        console.log(this);
    }
    updateOpponants() {
        if (this.challenger) {
            this.challenger.setOpponent(this.champion);
        }
        if (this.champion) {
            this.champion.setOpponent(this.challenger);
        }
    }
    public donate(donation: {id: number, name: string, amount: number, art: number}) {
        let champ: Combatant.Combatant | null;

        if (this.champion != null && this.champion.getID() == donation.id) {
            this.champion.donate(donation.amount);
        } else if (this.challenger != null && this.challenger.getID() == donation.id)
            this.challenger.donate(donation.amount);
        else if ((champ = this.searchQueue(donation.id)) != null)
            champ.donate(donation.amount)
        else {
            //replace with logic in seperate place
            let champ = new Combatant.Combatant(
                this.frontCtx,
                {x: 0, y: 0},
                donation.id,
                donation.name,
                iconArt[Math.floor((iconArt.length * Math.random()))],
                spriteArt[(donation.art - 1) % 5],
                {
                    hp: 1000,
                    att: donation.amount,
                    def: donation.amount,
                    attspd: 2000,
                    dmg: 50,
                    armr: 25,
                    regen: 200,
                }
            );
            champ.setPosition(Game.challengerLocation);
            this.queue.push(champ);
        }
    }
}

}