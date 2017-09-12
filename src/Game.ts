import * as Actor from './Actor';
import * as Combatant from './Combatant';
import * as ClassPicker from './ClassPicker';
import * as Chance from 'chance';

let iconArt = [
    'images/icons/cherries.png',
    'images/icons/banana.png',
    'images/icons/lime-icon.png',
    'images/icons/orange-icon.png'
];

const enum GameStates {
    waitingForChallenger,
    fighting,
    deathTimeout,
    moveChallengerToChampion
};

export class Game {
    private arena: Combatant.Combatant[] = [];
    private queue: Combatant.Combatant[] = [];
    private graveyard: Graveyard; 
    private frontCtx: CanvasRenderingContext2D;
    private backCtx: CanvasRenderingContext2D;
    private canvasSize: {x: number, y: number};
    private lastTimestamp: number = performance.now();
    private chance: Chance.Chance = new Chance.Chance();

    private state: GameStates = GameStates.waitingForChallenger;
    private timeout: number = 0; // used differently depening on state

    private static fightTimeout: number = 3000; // how long between fights in milliseconds
    private static deathTimeout: number = 3000; // how long to wait after dieing
    private static championLocation = {x: 20, y: 30};
    private static challengerLocation = {x: 100, y: 30};
    private static switchSidesTimeout: number = 3000;

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

        switch (this.state) {
            case GameStates.waitingForChallenger:
                if (this.timeout <= 0)
                    this.newChallenger();
                else
                    this.timeout -= timeDelta;
                break;
            case GameStates.deathTimeout:
                if (this.timeout <= 0)
                    this.clearDead()
                else
                    this.timeout -= timeDelta;
                break;
            case GameStates.fighting:
                break;
            case GameStates.moveChallengerToChampion:
                if (this.timeout <= 0) {
                    this.state = GameStates.waitingForChallenger;
                    this.timeout = Game.fightTimeout;
                    this.arena[0].setFacingDirection(false);
                } else {
                    this.timeout -= timeDelta;
                    let distance = Game.challengerLocation.x - Game.championLocation.x;
                    if (this.timeout < Game.switchSidesTimeout / 2) {
                        let offset = this.timeout / (Game.switchSidesTimeout / 2) * distance;
                        this.arena[0].setPosition({x: Game.championLocation.x + offset, y: Game.championLocation.y})
                    }
                }
                break;
            default:
                console.error('bad game state');
        }
        this.arena.forEach(c => c.tick(timeDelta));
        this.arena.forEach(c => c.draw());
        this.graveyard.draw();
        window.requestAnimationFrame(timestamp => {
            let delta = timestamp - this.lastTimestamp;
            this.lastTimestamp = timestamp;
            delta = delta * 2;
            this.tick(delta);
        });
    }
    newChallenger() {
        let champ = this.queue.shift();

        if (champ == undefined)
            return;

        this.arena.push(champ);
        this.timeout = Game.fightTimeout;
        
        this.updateArenaLocations();
        if (this.arena.length >= 2) {
            this.state = GameStates.fighting;
            this.arena.forEach(c => c.fight());
        }
        
        console.log("new challenger");
        console.log(this);
    }
    // update positions
    private updateArenaLocations() {
        if (this.arena[0]) {
            this.arena[0].setPosition(Game.championLocation);
            this.arena[0].setFacingDirection(false);
        }
        if (this.arena[1]) {
            this.arena[1].setPosition(Game.challengerLocation);
            this.arena[1].setFacingDirection(true);
        }
    }
    private clearDead() {
        // clean graveyard
        if (this.arena[0] && this.arena[0].isDead()) {
            this.graveyard.clearqueue();
            // new champion
            if (this.arena[1] && this.arena[1].isDead() == false) {
                this.state = GameStates.moveChallengerToChampion;
                this.timeout = Game.switchSidesTimeout;
            }
        }
        // clean arena
        this.arena = this.arena.filter(c => {
            if (c.isDead()) {
                this.graveyard.addloser(c);
                return false;
            }
            return true;
        });
        this.arena.forEach(c => c.heal());

        // if the right combatant died or they both died
        if (this.state != GameStates.moveChallengerToChampion) {
            this.state = GameStates.waitingForChallenger;
            this.timeout = Game.fightTimeout;
        }
    }
    public donate(donation: {id: number, name: string, amount: number, style: number, art: number}) {
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
                iconArt[this.chance.integer({min: 0, max: iconArt.length - 1})],
                pick.spriteUrl,
                pick.stats,
                () => {
                    this.state = GameStates.deathTimeout;
                    this.timeout = Game.deathTimeout;
                    this.arena.forEach(c => c.wait());
                },
                (combatant, damage, accuracy) => {
                    if (this.arena[0] && this.arena[0] != combatant)
                        this.arena[0].takeHit(damage, accuracy);
                    else if (this.arena[1])
                        this.arena[1].takeHit(damage, accuracy);
                },
                this.chance
            ));
        }
    }
    // does not update graveyard
    public seed(seed: number) {
        this.chance = new Chance(seed);
        this.arena.forEach(c => c.setChance(this.chance));
        this.queue.forEach(c => c.setChance(this.chance));
    }
}

class Graveyard extends Actor.Actor {
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
