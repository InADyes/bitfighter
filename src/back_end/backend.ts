import { BackToFrontMessage, CharacterChoice, CharacterChoices, FrontToBackMessage } from '../shared/frontEndMessage';
import { Game } from './Game';

document.addEventListener('DOMContentLoaded', function() {
    const newDonationButton = <HTMLButtonElement>document.getElementById('new-donation');
    const nameInputNode = <HTMLInputElement>document.getElementById('donation-name');
    const idInputNode = <HTMLInputElement>document.getElementById('donation-id');
    const bitsInputNode = <HTMLInputElement>document.getElementById('donation-bits');
    const artInputNode = <HTMLInputElement>document.getElementById('donation-art');
    newDonationButton.addEventListener('click', element => {
        const id = Number(idInputNode.value);
        const name = nameInputNode.value;
        const amount = Number(bitsInputNode.value);
        const art = Number(artInputNode.value);

        idInputNode.value = String(id + 1);

        if (art <= -1)
            game.donation(id, name, amount);
        else
            game.newCombatant({id, name, amount, character: art});
    });

    let requestIDs: number[] = [];

    const game = new Game(
        message => {
            const m: BackToFrontMessage = {
                newReel: message
            }
            localStorage.setItem('backToFront', JSON.stringify(m));
        },
        (id, chars) => {
            requestIDs.push(id);
            const m: BackToFrontMessage = {
                characterChoices: {
                    characters: chars
                }
            }
            localStorage.setItem('backToFront', JSON.stringify(m));
        }
    );
    
    window.addEventListener('storage', (e) => {
        const str = e.newValue;
        if (str == undefined) {
            console.error('bad storage event value');
            return;
        }
        switch(e.key) {
            case 'frontToBack':
                const id = requestIDs.shift();
                if (id === undefined) {
                    console.log('no id\s');
                    break;
                }
                const message = <FrontToBackMessage>JSON.parse(str);
                game.frontEndSelection(id, message.characterChoice.choice);
                break;
            case 'backToFront':
                break;
            default:
                console.error('unidentified storage event');
        }
    });
});
