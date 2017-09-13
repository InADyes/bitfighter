#!/usr/bin/env node

import * as Combatant from '../shared/Combatant';
import * as ClassPicker from '../shared/ClassPicker';
import * as Reel from '../shared/DisplayReel';

let iconArt = [
    'images/icons/cherries.png',
    'images/icons/banana.png',
    'images/icons/lime-icon.png',
    'images/icons/orange-icon.png'
];

const enum GameStates {
    waitingForChallenger,
    fighting,
    deathTimeout
};



// export class Game {
//     private arena: Combatant.Combatant[] = [];
//     private queue: Combatant.Combatant[] = [];
//     private lastTimestamp: number = performance.now();

//     private reelTimestamp: number = this.lastTimestamp;
//     private reel: Reel.Event[] = [];

//     private state: GameStates = GameStates.waitingForChallenger;
//     private timeout: number = 0; // used differently depening on state

//     private static fightTimeout: number = 3000; // how long between fights in milliseconds
//     private static deathTimeout: number = 3000; // how long to wait after dieing
//     private static switchSidesTimeout: number = 3000;

//     constructor (public newReel: (reel: Reel.Event[]) => void) {};

//     private searchQueue(id: number) {
//         for (let champ of this.queue) {
//             if (champ.getID() == id)
//                 return champ;
//         }
//         return null;
//     }
//     //either moves somone from the queue to the arena or ticks the arena
//     public tick(timeDelta: number) {
//         switch (this.state) {
//             case GameStates.waitingForChallenger:
//                 if (this.timeout <= 0)
//                     this.newChallenger();
//                 else
//                     this.timeout -= timeDelta;
//                 break;
//             case GameStates.deathTimeout:
//                 if (this.timeout <= 0) {
//                     this.clearDead();
//                 }
//                 else
//                     this.timeout -= timeDelta;
//                 break;
//             case GameStates.fighting:
//                 break;
//             default:
//                 console.error('bad game state');
//         }
//         this.arena.forEach(c => c.tick(timeDelta));
//         window.requestAnimationFrame(timestamp => {
//             let delta = timestamp - this.lastTimestamp;
//             this.lastTimestamp = timestamp;
//             delta = delta * 4;
//             this.tick(delta);
//         });
//     }
//     private newChallenger() {
//         let champ = this.queue.shift();

//         if (champ == undefined)
//             return;

//         this.arena.push(champ);
//         this.timeout = Game.fightTimeout;
      
//         if (this.arena.length >= 2) {
//             this.state = GameStates.fighting;
//             this.arena.forEach(c => c.fight());
//         }


//         console.log("new challenger");
//         console.log(this);
//     }
//     private clearDead() {
//         // clean arena
//         for (let i = 0; i < this.arena.length;) {
//             if (this.arena[i].isDead()) {
//                 this.reel.push(new Reel.ClearUpdate(this.reelTimestamp, i));
//                 this.arena = this.arena.splice(i, 1);
//             }else
//                 i++;
//         }
//         this.arena.forEach(c => c.heal());
        
//         this.newReel(this.reel);
//         this.reel = [];

//         this.state = GameStates.waitingForChallenger;
//         this.timeout = Game.fightTimeout;
//     }
//     public donate(donation: {id: number, name: string, amount: number, art: number}) {
//         let champ: Combatant.Combatant | null;

//         if (this.arena[0] && this.arena[0].getID() == donation.id)
//             this.arena[0].donate(donation.amount);
//         else if (this.arena[1] && this.arena[1].getID() == donation.id)
//             this.arena[1].donate(donation.amount);
//         else if ((champ = this.searchQueue(donation.id)) != null)
//             champ.donate(donation.amount)
//         else {
//             let pick = ClassPicker.pickCharacter(donation);
//             this.queue.push(new Combatant.Combatant(
//                 donation.id,
//                 donation.name,
//                 pick.stats,
//                 () => {
//                     this.state = GameStates.deathTimeout;
//                     this.timeout = Game.deathTimeout;
//                     this.arena.forEach(c => c.wait());
//                 },
//                 (combatant, damage, accuracy) => {
//                     if (this.arena[0] && this.arena[0] != combatant)
//                         this.arena[0].takeHit(damage, accuracy);
//                     else if (this.arena[1])
//                         this.arena[1].takeHit(damage, accuracy);
//                     else
//                         console.error('this should be impossible to reach');
//                 },
//                 (combatant, event) => {
//                     //todo: could be more safe
//                     if (this.arena[0] && this.arena[0] == combatant)
//                         event.character = 0;
//                     else
//                         event.character = 1;
//                     this.reel.push(event);
//                 }
//             ));
//         }
//     }
// }
