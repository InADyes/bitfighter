/// <reference path='Actor.ts' />
/// <reference path='Combatant.ts' />
/// <reference path='ClassPicker.ts' />

namespace Game {
    
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
    private graveyard: Graveyard; 
    private frontCtx: CanvasRenderingContext2D;
    private backCtx: CanvasRenderingContext2D;
    private canvasSize: {x: number, y: number};
    private lastTimestamp: number = performance.now();

    private static fightTimeout: number = 3000; // how long between fights in milliseconds
    private checkQueue: number = Game.fightTimeout; // countdown for starting a new fight
    private static championLocation = {x: 20, y: 30};
    private static challengerLocation = {x: 100, y: 30};

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
        this.graveyard = new Graveyard(this.frontCtx, {x: 0, y: 0});

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
        this.graveyard.draw();
        window.requestAnimationFrame((timestamp) => {
            let delta = timestamp - this.lastTimestamp;
            this.lastTimestamp = timestamp;
            //delta = delta * 4;
            this.tick(delta);
        });
    }
    checkDeath() {
        if (this.challenger && this.challenger.isDead()) {
            if(this.champion == null)
                return;
            this.graveyard.addloser(this.challenger);
            this.challenger = null;
            this.champion.heal();
            this.updateOpponants();
        }
        if (this.champion && this.champion.isDead()) {
            if (this.challenger) {
                this.graveyard.clearqueue();
                this.graveyard.addloser(this.champion);
                this.champion = this.challenger;
                this.champion.setPosition(Game.championLocation);
                this.champion.setFacingDirection(false);
                this.challenger = null;
                this.champion.heal();
                this.updateOpponants();
            } else {
                this.graveyard.clearqueue();
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
            champ.setFacingDirection(false);
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
            let pick = ClassPicker.pickCharacter(donation);
            let champ = new Combatant.Combatant(
                this.frontCtx,
                {x: 0, y: 0},
                donation.id,
                donation.name,
                iconArt[Math.floor((iconArt.length * Math.random()))],
                pick.spriteUrl,
                pick.stats
            );
            champ.setPosition(Game.challengerLocation);
            champ.setFacingDirection(true);
            this.queue.push(champ);
        }
    }
}

export class Graveyard extends Actor{
    //private graveyardowner: number;
    private graveyardqueue: Combatant.Combatant[] = [];

   // constructor(ctx: CanvasRenderingContext2D,  pos: {x: number, y: number}, graveyardid: number) {
   //     super(ctx ,pos);
    //this.graveyardowner = graveyardid;
   // }
  
    public addloser(champ: Combatant.Combatant) {
        this.graveyardqueue.push(champ);
    }
    public newqueue(champ: Combatant.Combatant) {
        this.graveyardqueue = [];
        this.graveyardqueue.push(champ);
    }
    public clearqueue() {
        this.graveyardqueue = [];
    }
    public draw() {
        for(let i = 0; i < this.graveyardqueue.length; i++)
            this.ctx.drawImage(this.graveyardqueue[i].getIcon(), 0, 0 + 20 * i);
    }

    public tick() {

    }
}


}
