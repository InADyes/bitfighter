/// <reference path='Actor.ts' />
/// <reference path='Champion.ts' />

// function animateHealth(canvas: HTMLCanvasElement, champ: Champion, hpChange: number, x: number, y: number, game: Game) {
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

// function animateNegative(ctx: CanvasRenderingContext2D, champ: Champion, hpChange: number, x: number, y: number, game: Game) {
//     champ.status.health -= 1;
//     hpChange--;
//     ctx.clearRect(x,y-120, x+75, y-50);
//     var chamshake = new Image();
    
//     chamshake.src = champ.art;

//     if(hpChange%2 != 0)
//         ctx.drawImage(chamshake, x+15,y-120,100,100);
//     else
//         ctx.drawImage(chamshake, x+20,y-120,100,100);
//     //ctx.drawImage()
//     drawHP(ctx, champ.status.health, x, y);
//     if (hpChange > 0 && champ.status.health > 0)
//         window.requestAnimationFrame(animateNegative.bind(null, ctx, champ, hpChange, x, y, game));
//     else
//         window.setTimeout(game.checkDeath.bind(game), 1000);
// }

// function animatePositive(ctx: CanvasRenderingContext2D, champ: Champion, hpChange: number, x: number, y: number) {
//     console.log("hpchange: ", hpChange);
//     champ.status.health += 1;
//     hpChange++;
//     drawHP(ctx, champ.status.health, x, y);
//     if (hpChange > 0 && champ.status.health < 100)
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

class Game extends Actor {
    private challenger: Champion | null = null;
    private champion: Champion | null = null;
    private queue: Champion[] = [];
    private graveyard: Champion[] = [];
    private frontCtx: CanvasRenderingContext2D;
    private backCtx: CanvasRenderingContext2D;
    private lastTimestamp: number;

    constructor(front: HTMLCanvasElement, back: HTMLCanvasElement) {
        super();
        let frontCtx = front.getContext('2d');
        let backCtx = front.getContext('2d');
        if (frontCtx == null || backCtx == null) {
            console.error("could not get get canvas 2d context");
            return;
        }

        this.frontCtx = frontCtx;
        this.backCtx = backCtx;
    }

    private searchQueue(id: number) {
        for (let champ of this.queue) {
            if (champ.id == id)
                return champ;
        }
        return null;
    }
    //either moves somone from the queue to the arena or ticks the arena
    public tick(timeDelta: number) {
        this.draw({x: 0, y: 0});
        window.requestAnimationFrame((timestamp) => {
            let delta = timestamp - this.lastTimestamp;
            this.lastTimestamp = timestamp;
            this.tick(delta);
        });
    }
    // checkDeath() {
    //     if (this.champion) {
    //         console.log(`champion health: ${this.champion.status.health}`);
    //         if (this.champion.status.health <= 0) {
    //             this.graveyard.push(this.champion);
    //             this.champion = null;
    //         }
    //     }
    //     if (this.challenger) {
    //         console.log(`challenger health: ${this.challenger.status.health}`);
    //         if (this.challenger.status.health <= 0) {
    //             this.graveyard.push(this.challenger);
    //             this.challenger = null;
    //         }
    //     }
    //     if (this.champion == null && this.challenger) {
    //         this.champion = this.challenger;
    //         this.challenger = null;

    //         //set the graveyard
    //         let champ = this.graveyard.pop();
    //         this.graveyard = [];
    //         if (champ)
    //             this.graveyard.push(champ);
    //     }
    //     tickCanvas(this, this.canvas);
    //     //post battle heal
    //     if (this.champion && this.challenger == null) {
    //         window.setTimeout(this.healChampion.bind(this), 2000);
    //     }
    //     window.setTimeout(this.tick.bind(this), 4000);
    // }
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
    }
    public donate(donation: {id: number, name: string, amount: number, art: number}) {
        let champ: Champion | null;
    
        if (this.champion != null && this.champion.id == donation.id) {
            //chapion donation
            this.champion.status.power += donation.amount;
            this.champion.status.health += donation.amount;
        } else if (this.challenger != null && this.challenger.id == donation.id) {
            //challenger donation
            this.challenger.status.power += donation.amount;
            this.challenger.status.health += donation.amount;
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
}
