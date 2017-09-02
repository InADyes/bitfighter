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
    private arena: Combatant.Combatant[] = [];
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
        this.frontCtx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);

        if (this.arena.length < 2) {
            if (this.checkQueue <= 0)
                this.newChallenger();
            else
                this.checkQueue -= timeDelta;
        }
        this.arena.forEach(c => c.tick(timeDelta));
        this.arena.forEach(c => c.draw());
        this.graveyard.draw();
        window.requestAnimationFrame(timestamp => {
            let delta = timestamp - this.lastTimestamp;
            this.lastTimestamp = timestamp;
            delta = delta * 4;
            this.tick(delta);
        });
    }
    //somone died in the arena
    arenaDeath(combatant: Combatant.Combatant) {
        let index = this.arena.indexOf(combatant);
        this.arena.splice(index, 1);
        if (this.arena[0])
            this.arena[0].heal();
        this.updateArenaState();
    }
    newChallenger() {
        let champ = this.queue.shift();

        if (champ == undefined) {
            return;
        }

        this.arena.push(champ);
        this.checkQueue = Game.fightTimeout;
        this.updateArenaState();
    
        console.log("new challenger");
        console.log(this);
    }
    private updateArenaState() {
        // update positions
        if (this.arena[0]) {
            this.arena[0].setPosition(Game.championLocation);
            this.arena[0].setFacingDirection(false);
        }
        if (this.arena[1]) {
            this.arena[1].setPosition(Game.challengerLocation);
            this.arena[1].setFacingDirection(true);
        }

        // update mode
        if (this.arena.length > 1)
            this.arena.forEach(c => c.fight());
        else
            this.arena.forEach(c => c.wait());
    }
    public donate(donation: {id: number, name: string, amount: number, art: number}) {
        let champ: Combatant.Combatant | null;

        if (this.arena[0] && this.arena[0].getID() == donation.id)
            this.arena[0].donate(donation.amount);
        else if (this.arena[1] && this.arena[1].getID() == donation.id)
            this.arena[1].donate(donation.amount);
        else if ((champ = this.searchQueue(donation.id)) != null)
            champ.donate(donation.amount)
        else {
            let pick = ClassPicker.pickCharacter(donation);
            this.queue.push(new Combatant.Combatant(
                this.frontCtx,
                Game.challengerLocation,
                donation.id,
                donation.name,
                iconArt[Math.floor((iconArt.length * Math.random()))],
                pick.spriteUrl,
                pick.stats,
                this.arenaDeath.bind(this),
                (combatant, damage, accuracy) => {
                    if (this.arena[0] && this.arena[0] != combatant)
                        this.arena[0].takeHit(damage, accuracy);
                    else if (this.arena[1])
                        this.arena[1].takeHit(damage, accuracy);
                }
            ));
        }
    }
}

class Graveyard extends Actor{
    private graveyardqueue: Combatant.Combatant[] = [];
  
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
        for (let i = 0; i < this.graveyardqueue.length; i++)
            this.ctx.drawImage(this.graveyardqueue[i].getIcon(), 0, 0 + 20 * i);
    }

    public tick() {}
}

}
