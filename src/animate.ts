/// <reference path="game.ts" />

namespace Animate {
    export function tickCanvas(game: Game.Game) {
        let ctx = game.canvas.getContext("2d");
        if (ctx == null) {
            console.error("why is ctx null, wtf");
            return;
        }
        ctx.clearRect(0, 0, game.canvas.height, game.canvas.width);
        ctx.font = "30px Arial";
        ctx.fillText(String(game.counter), 10, 50);
        game.counter++;
    }
}