/// <reference path="game.ts" />
/// <reference path="logic.ts" />

window.onload = function() {
    let newDonationButton = document.getElementById("new-donation");
    let newFightButton = document.getElementById("new-fight");
    let gameTickButton = document.getElementById("tick-fight");
    let nameInputNode = <HTMLInputElement>document.getElementById("donation-name");
    let idInputNode = <HTMLInputElement>document.getElementById("donation-id");
    let bitsInputNode = <HTMLInputElement>document.getElementById("donation-bits");
    let arenaCanvas = <HTMLCanvasElement>document.getElementById("arena");
    if (newDonationButton == null || newFightButton == null || gameTickButton == null || nameInputNode == null || bitsInputNode == null || arenaCanvas == null) {
        console.error("missing DOM hook");
        return;
    }
    newDonationButton.addEventListener("click", function(element){
        let id = Number(idInputNode.value);
        let name = nameInputNode.value;
        let bits = Number(bitsInputNode.value);

        idInputNode.value = String(id + 1);

        game.newDonation(id, name, bits);
    });
    newFightButton.addEventListener("click", function(){
        game.newFight();
    });
    gameTickButton.addEventListener("click", function(){
        game.tickFight();
    });

    //todo: need to hook into canvas or graphics here eventually
    let game = new Game.Game(
        arenaCanvas,
        Logic.handleNewChallenger,
        Logic.boostChamp,
        Logic.boostChamp,
        Logic.handleNewFight,
        Logic.handleTickFight
    );
};
