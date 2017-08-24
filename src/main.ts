/// <reference path="Game.ts" />
/// <reference path="animate.ts" />


document.addEventListener("DOMContentLoaded", function(){
    let newDonationButton = document.getElementById("new-donation");
    let nameInputNode = <HTMLInputElement>document.getElementById("donation-name");
    let idInputNode = <HTMLInputElement>document.getElementById("donation-id");
    let bitsInputNode = <HTMLInputElement>document.getElementById("donation-bits");
    let arenaCanvas = <HTMLCanvasElement>document.getElementById("arena");
    if (newDonationButton == null || nameInputNode == null || bitsInputNode == null || arenaCanvas == null) {
        console.error("missing DOM hook");
        return;
    }
    newDonationButton.addEventListener("click", function(element){
        let id = Number(idInputNode.value);
        let name = nameInputNode.value;
        let amount = Number(bitsInputNode.value);

        idInputNode.value = String(id + 1);

        game.donate({id, name, amount});
    });

    let game = new Game(arenaCanvas);
    game.tick();
});
