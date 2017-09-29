import { pickCharacter } from '../shared/characterPicker';
import { BitFighter as BitFighterBack } from '../back_end/BitFighter';
import { BitFighter as BitFighterFront } from '../front_end/BitFighter';
import { BackToFrontMessage, FrontToBackMessage, CharacterChoice, FrontEndSettings as Settings } from '../shared/frontEndMessage';

window.addEventListener('load', function(){
    const wrapperDiv = <HTMLDivElement>document.getElementById('bitfighter');

    const frontend = new BitFighterFront(
        wrapperDiv,
        {
            position: {
                x: 10,
                y: 40
            },
            size: 1,
            cardsTimeout: 60000
        },
        (slug, message) => {
            const id = requestIDs.shift()

            if (id == undefined) {
                console.log('no id in queue');
                return;
            }

            backend.receivedFanGameState(id, message);
        }
    );

    let requestIDs: number[] = [];
    
    const backend = new BitFighterBack(
        message => {
            if (message.characterChoices) {
                if (message.id === undefined) {
                    console.error('shouldn\'t push character choice to everyone');
                    return;
                }
                requestIDs.push(message.id);
            }
            frontend.recievedViewerGameState(message);
        },
        {
            delayBetweenFights: 3000,
            gameSpeedMultipier: 1,
            minimumDonation: 1000,
            donationToHPRatio: 1
        }
    );

    // temp
    let x = <HTMLButtonElement>document.getElementById('addBuff');
    x.addEventListener("click", ()=> {
        let a = <HTMLInputElement>document.getElementById("duration");
        let b = <HTMLInputElement>document.getElementById("art");
        let c = <HTMLInputElement>document.getElementById("player");
        let duration = Number(a.value);
        let art = Number(b.value);
        let player = Number(c.value);
    
        frontend.addBuff(art, duration, player);
    });
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
            backend.donation(id, name, amount, 'todo: url goes here', 'how\'re you doin\'?');
        else
            backend.newCombatant(pickCharacter({id, name, amount, character: art, profileImageURL: 'todo: url goes here', chatMessage: 'how\'re you doin\'?'}));
    });
});

