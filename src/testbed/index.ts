import { pickCharacter } from '../shared/characterPicker';
import { BitFighter as BitFighterBack } from '../back_end/BitFighter';
import { BitFighter as BitFighterFront } from '../front_end/BitFighter';
import { BackToFrontMessage, FrontToBackMessage, CharacterChoice, FrontEndSettings as Settings } from '../shared/frontEndMessage';

// kind of a hack
declare let window: any;

window.recalcHp = function (damageAmount: number, newHp: number, maxHp: number) {
    //console.log("called recalchp");
}
window.flip = function (side: 'front' | 'back') {
    //console.log("called flip");
}
window.updateBitBoss = function (bossData: Object) {
    //console.log("called updateBitBoss");
}

window.addEventListener('load', function(){
    const wrapperDiv = <HTMLDivElement>document.getElementById('bitfighter');
    let requestIDs: number[] = [];
    
    const backend = new BitFighterBack(
        (message, id) => {
            window.setTimeout(()=> {
                if (message.characterChoices) {
                    if (id === undefined) {
                        console.error('shouldn\'t push character choice to everyone');
                        return;
                    }
                    requestIDs.push(id);
                }
                console.log('message, back to front:', message);
                frontend.receivedViewerGameState(message);
            }, 0)
        },
        {
            delayBetweenFights: 3000,
            minimumDonation: 200,
            donationToHPRatio: 1,
            defaultState: {
                name: 'ravi II',
                profileImageURL: 'testbed_images/banana_icon.png',
                chatMessage: 'look at me'
            }
        }
    );

    const frontend = new BitFighterFront(
        wrapperDiv,
        {
            position: {
                x: 10,
                y: 40
            },
            size: 1,
            cardsTimeout: 60000,
            assetsShim: './'
        },
        (slug, message) => {
            window.setTimeout(() => {
                let id = requestIDs.shift()
    
                if (id === undefined)
                    id = -1;
    
                backend.receivedFanGameState(id, message);
            }, 0);
        }
    );


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

