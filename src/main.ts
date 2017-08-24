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

    //todo: need to hook into canvas or graphics here eventually
    let game = new Game();
    //game.tick();
    let game2 = new Game();
    let champ = new Champion(10, "max", "images/icon.png",{health: 100, power: 10, heal: 10});
    let challen = new Champion(10, "shawn", "images/icon.png",{health: 100, power: 10, heal: 10});
    game2.challenger = challen;
    game2.champion = champ;
    tickCanvas(game2, arenaCanvas);
    
 /*   let ctx = arenaCanvas.getContext("2d");
    if (ctx == null) {
        console.error("why is ctx null, wtf");
        return;
    } 
    ctx.clearRect(0, 0, arenaCanvas.height, arenaCanvas.width);
    var champCharac = new Image();
    champCharac.onload = function(){
        if (ctx == null)
            return;
        ctx.drawImage(champCharac, 0, 0);
    }
    champCharac.src = "images/champion_alpha.png";*/
});
