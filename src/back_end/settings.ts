import * as Game from './Game';

document.addEventListener('DOMContentLoaded', function() {
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

        game.addCombatant({id: id, name: name, amount: amount, character: art});
    });

    let game = new Game.Game(message => {
        localStorage.setItem('fight', JSON.stringify(message));
    });
});
