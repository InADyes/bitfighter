import { CharacterChoice, CharacterChoices } from '../shared/frontEndMessage';
import { Game } from './Game';

document.addEventListener('DOMContentLoaded', function() {
    const newDonationButton = <HTMLButtonElement>document.getElementById('new-donation');
    const nameInputNode = <HTMLInputElement>document.getElementById('donation-name');
    const idInputNode = <HTMLInputElement>document.getElementById('donation-id');
    const bitsInputNode = <HTMLInputElement>document.getElementById('donation-bits');
    const artInputNode = <HTMLInputElement>document.getElementById('donation-art');
    if (newDonationButton == null || nameInputNode == null || bitsInputNode == null) {
        console.error('missing DOM hook');
        return;
    }
    newDonationButton.addEventListener('click', element => {
        const id = Number(idInputNode.value);
        const name = nameInputNode.value;
        const amount = Number(bitsInputNode.value);
        const art = Number(artInputNode.value);

        idInputNode.value = String(id + 1);

        game.donation({id: id, name: name, amount: amount, character: art});
    });

    let requestIDs: number[] = [];

    const game = new Game(
        message => {
            localStorage.setItem('fight', JSON.stringify(message));
        },
        (id, chars) => {
            requestIDs.push(id);
            const characterChoices: CharacterChoices = {
                characters: chars
            }
            localStorage.setItem('characterChoice', JSON.stringify(characterChoices));
        }
    );
    
    window.addEventListener('storage', (e) => {
        const str = e.newValue;
        if (str == undefined) {
            console.error('bad storage event value');
            return;
        }
        switch(e.key) {
            case 'choiceResult':
                const id = requestIDs.shift();
                if (id === undefined) {
                    console.log('no id\s');
                    break;
                }
                const characterChoice = <CharacterChoice>JSON.parse(str);
                game.frontEndSelection(id, characterChoice.choice)
                break;
            case 'characterChoice':
            case 'fight':
                break;
            default:
                console.error('unidentified storage event');
        }
    });
});
