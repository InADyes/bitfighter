import { pickCharacter } from '../shared/characterPicker';
import { BackToFrontMessage, CharacterChoice, CharacterCard, FrontToBackMessage } from '../shared/frontEndMessage';
import { BitFighter } from '../back_end/BitFighter';

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
            game.donation(id, name, amount, 'todo: url goes here', 'how\'re you doin\'?');
        else
            game.newCombatant(pickCharacter({id, name, amount, character: art, profileImageURL: 'todo: url goes here', chatMessage: 'how\'re you doin\'?'}));
    });

    let requestIDs: number[] = [];

    const game = new BitFighter(
        message => {
            if (message.characterChoices) {
                if (message.id === undefined) {
                    console.error('shouldn\'t push character choice to everyone');
                    return;
                }
                requestIDs.push(message.id);
            }
            localStorage.setItem('backToFront', JSON.stringify(message));
        },
        {
            delayBetweenFights: 3000,
            gameSpeedMultipier: 1,
            minimumDonation: 1000,
            donationToHPRatio: 1
        }
    );
    
    window.addEventListener('storage', (e) => {
        const str = e.newValue;
        if (str == undefined) {
            console.error('bad storage event value');
            return;
        }
        console.log('storage event: ', e);
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
        console.log('result state: ', game);
    });
});
