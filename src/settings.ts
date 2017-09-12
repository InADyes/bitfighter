import * as Game from './back_end/Game';

document.addEventListener("DOMContentLoaded", function() {
    let newDonationButton = document.getElementById('new-donation');
    let nameInputNode = <HTMLInputElement>document.getElementById('donation-name');
    let idInputNode = <HTMLInputElement>document.getElementById('donation-id');
    let bitsInputNode = <HTMLInputElement>document.getElementById('donation-bits');
    let artInputNode = <HTMLInputElement>document.getElementById('donation-art');
    if (newDonationButton == null || nameInputNode == null || bitsInputNode == null) {
        console.error('missing DOM hook');
        return;
    }
    newDonationButton.addEventListener('click', element => {
        let id = Number(idInputNode.value);
        let name = nameInputNode.value;
        let amount = Number(bitsInputNode.value);
        let art = Number(artInputNode.value);

        idInputNode.value = String(id + 1);

        //game.donate({id: id, name: name, amount: amount, art: art});
    });
    
    // let game = new Game.Game(reel => {
    //     localStorage.setItem('reel', JSON.stringify(reel));
    // });

    //game.tick(performance.now());
});


 