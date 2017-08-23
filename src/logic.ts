/// <reference path="game.ts" />

namespace Logic {
    export interface Stats {
        health: number;
    }
    export function handleNewChallenger(canvas: HTMLCanvasElement, id: number, name: string, bits: number) {
        let challenger = new Game.Champion(id, name, {health: bits})
    
        console.log(`new challenger: ${challenger}`);
        console.log(challenger);
        return challenger;
    }
    export function handleNewFight(canvas: HTMLCanvasElement, queue: Game.Champion[]) {
        let champion = queue.pop();
        if (champion == undefined)
            return null;
        return champion;
    }
    export function handleTickFight(canvas: HTMLCanvasElement, champion: Game.Champion, challenger: Game.Champion) {
        console.log("fight tick");
    }
    export function boostChamp(canvas: HTMLCanvasElement, champ: Game.Champion, bits: number) {
        console.log(`increasing ${champ}'s health by ${bits}`);
        champ.status.health += bits;
    }
}
