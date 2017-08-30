/// <reference path='Game.ts' />


document.addEventListener("DOMContentLoaded", function(){
   // let newDonationButton = document.getElementById("new-donation");
   // let nameInputNode = <HTMLInputElement>document.getElementById("donation-name");
   // let idInputNode = <HTMLInputElement>document.getElementById("donation-id");
   // let bitsInputNode = <HTMLInputElement>document.getElementById("donation-bits");
   // let artInputNode = <HTMLInputElement>document.getElementById("donation-art");
    let arenaFront = <HTMLCanvasElement>document.getElementById("arena-front");
    let arenaBack = <HTMLCanvasElement>document.getElementById("arena-front");
    if (arenaFront == null || arenaBack == null) {
        console.error("missing DOM hook");
        return;
    }
    window.addEventListener("storage", function(element){
        let id = Number(localStorage.getItem("LSDonID"));
        let name = localStorage.getItem("LSDonName");
        let amount = Number(localStorage.getItem("LSDonBits"));
        let art = Number(localStorage.getItem("LSDonArt"));

        //idInputNode.value = String(id + 1);
        let ctx = arenaFront.getContext("2d");
        //game.donate({id, name, amount, art});
        if (ctx == null)
            return;
        ctx.font = "10px Arial";
        ctx.fillText(String(id),0,0);
        ctx.fillText(String(name),0,10);
        ctx.fillText(String(amount),0,20);
        ctx.fillText(String(art),0,30);
    });

    let game = new Game.Game(arenaFront, arenaBack);
    game.tick(performance.now());
});
