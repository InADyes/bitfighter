import { pickCharacter } from '../shared/characterPicker';
import { BitFighter as BitFighterBack } from '../back_end/BitFighter';
import { BitFighter as BitFighterFront } from '../front_end/BitFighter';
import { BackToFrontMessage } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage, CharacterChoice } from '../shared/interfaces/frontToBackMessage';
import { FrontEndSettings } from '../front_end/settings';

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
    const cardDiv = <HTMLDivElement>document.getElementById('charSelect');
    let requestIDs: number[] = [];
    
    const backend = new BitFighterBack(
        (message, id) => {
            window.setTimeout(()=> {
                console.log('message, back to front:', message);
                if (message.characterChoices) {
                    if (id === undefined) {
                        console.error('shouldn\'t push character choice to everyone');
                        return;
                    }
                    requestIDs.push(id);
                }
                frontend.receivedViewerGameState(message);
            }, 0)
        },
        {
            delayBetweenFights: 3000,
            minimumDonation: 200,
            donationToHPRatio: 1,
            defaultState: {
                id: -1,
                name: 'ravi II',
                amount: 1000,
                profileImageURL: 'testbed_images/banana_icon.png',
                chatMessage: 'look at me',
                emoticonURL: ''
            }
        },
        str => console.log('new gamestate save:', str)
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
                console.log('message, front to back:', message);
                let id = -1;
                if (message.characterChoice)
                    id = requestIDs.shift() || -1;
    
                backend.receivedFanGameState(id, message);
            }, 0);
        },
        cardDiv
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
            backend.donation({
                id,
                name,
                amount,
                profileImageURL: 'todo: url goes here',
                chatMessage: 'how\'re you doin\'?',
                emoticonURL: ''
            });
        else
            backend.newCombatant(pickCharacter({
                id,
                name,
                amount,
                profileImageURL: 'todo: url goes here',
                chatMessage: 'how\'re you doin\'?',
                emoticonURL: ''
            }, art));
    });
});

