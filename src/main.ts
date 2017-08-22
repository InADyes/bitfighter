/// <reference path="game.ts" />
/// <reference path="logic.ts" />

window.onload = function() {
    let newChallengerButton = document.getElementById("new-challenger");
    let newFightButton = document.getElementById("new-fight");
    let gameTickButton = document.getElementById("tick-fight");
    let nameInputNode = <HTMLInputElement>document.getElementById("challenger-name");
    let statInputNode = <HTMLInputElement>document.getElementById("challenger-stat");
    if (newChallengerButton == null || newFightButton == null || gameTickButton == null || nameInputNode == null || statInputNode == null) {
        console.error("missing DOM hook");
        return;
    }
    newChallengerButton.addEventListener("click", function(){
        let name = nameInputNode.value;
        let health = Number(statInputNode.value);
        game.newChallenger(new Game.Champion(name, {health: health}));
    });
    newFightButton.addEventListener("click", function(){
        game.newFight();
    });
    gameTickButton.addEventListener("click", function(){
        game.tickFight();
    });

    //todo: need to hook into canvas or graphics here eventually
    let game = new Game.Game(
        Logic.handleNewChallenger,
        Logic.handleNewFight,
        Logic.handleTickFight
    );
};
