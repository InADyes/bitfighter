/// <reference path="Game.ts" />

function newChallenger(game: Game.Game) {
    let nameNode = <HTMLInputElement>document.getElementById("challenger-name")
    if (nameNode == null) {
        console.error("challengerName is empty");
        return;
    }
    let statNode = <HTMLInputElement>document.getElementById("challenger-stat")
    if (statNode == null) {
        console.error("challengerStat is empty");
        return;
    }
    let name = nameNode.value;
    let health = Number(statNode.value);

    game.newChallenger(new Game.Champion(name, {health: health}));
}

window.onload = function() {
    let game = new Game.Game(
        function(challenger: Game.Champion) {
            console.log(`new challenger: ${challenger}\n`);
            console.log(challenger);
        },
        function(queue: Game.Champion[]) {
            let champion = queue.pop();
            if (champion == undefined)
                return null;
            return champion;
        },
        function(champion: Game.Champion, challenger: Game.Champion) {
            console.log("fight tick");
        }
    );
    var newChallengerButton = document.getElementById("new-challenger")
    if (newChallengerButton == null) {
        console.error("no new-challenger button found");
        return;
    }
    newChallengerButton.addEventListener("click", function(){
        newChallenger(game)
    });
    var newChallengerButton = document.getElementById("new-fight")
    if (newChallengerButton == null) {
        console.error("no new-fight button found");
        return;
    }
    newChallengerButton.addEventListener("click", function(){
        game.newFight();
    });
    var newChallengerButton = document.getElementById("tick-fight")
    if (newChallengerButton == null) {
        console.error("no tick-fight button found");
        return;
    }
    newChallengerButton.addEventListener("click", function(){
        game.tickFight();
    });
};
