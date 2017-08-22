namespace Logic {
    export interface Stats {
        health: number;
    }
    export function handleNewChallenger(canvas: HTMLCanvasElement, challenger: Game.Champion) {
        console.log(`new challenger: ${challenger}`);
        console.log(challenger);
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
}
