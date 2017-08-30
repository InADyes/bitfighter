<<<<<<< HEAD
/*/// <reference path='game/Game.ts' />


=======
>>>>>>> 9d3f596a8ffe78b78a4604441e912f8d6d98ea21
document.addEventListener("DOMContentLoaded", function(){
    let newDonationButton = document.getElementById("new-donation");
    let nameInputNode = <HTMLInputElement>document.getElementById("donation-name");
    let idInputNode = <HTMLInputElement>document.getElementById("donation-id");
    let bitsInputNode = <HTMLInputElement>document.getElementById("donation-bits");
    let artInputNode = <HTMLInputElement>document.getElementById("donation-art");
    if (newDonationButton == null || nameInputNode == null || bitsInputNode == null) {
        console.error("missing DOM hook");
        return;
    }
    newDonationButton.addEventListener("click", function(element){
        let id = Number(idInputNode.value);
        let name = nameInputNode.value;
        let amount = Number(bitsInputNode.value);
        let art = Number(artInputNode.value);

        idInputNode.value = String(id + 1);

        localStorage.setItem("donation", JSON.stringify({id: id, name: name, amount: amount, art: art}));
    });
});
*/
document.addEventListener("DOMContentLoaded", function(){
     let newDonationButton = document.getElementById("new-donation");
     let nameInputNode = <HTMLInputElement>document.getElementById("donation-name");
     let idInputNode = <HTMLInputElement>document.getElementById("donation-id");
     let bitsInputNode = <HTMLInputElement>document.getElementById("donation-bits");
     let artInputNode = <HTMLInputElement>document.getElementById("donation-art");
    // let arenaFront = <HTMLCanvasElement>document.getElementById("arena-front");
    // let arenaBack = <HTMLCanvasElement>document.getElementById("arena-front");
    if (newDonationButton == null || nameInputNode == null || idInputNode == null || bitsInputNode == null || artInputNode == null)
        {
            console.log("initial fail");
            return;
        } 
    newDonationButton.addEventListener("click",function(element){
        if(nameInputNode.value == null || idInputNode.value == null || bitsInputNode.value == null || artInputNode.value == null)
            {
                console.log("missing stats");
                return;
            }
        else
            {
                localStorage.setItem("LSDonName", nameInputNode.value);
                localStorage.setItem("LSDonID", idInputNode.value);
                localStorage.setItem("LSDonBits", bitsInputNode.value);
                localStorage.setItem("LSDonArt", artInputNode.value);
            }        
    });
    
    window.addEventListener('storage', function(element){
        window.alert("storage changed");
    })
 });
 