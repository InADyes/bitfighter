import { pickCharacter } from './shared/characterPicker';
import { Backend } from './backend/Backend';
import { Frontend } from './frontend/Frontend';
import { BackToFrontMessage, FrontEndSettings } from './shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from './shared/interfaces/frontToBackMessage';


window.addEventListener('load', function(){
    const wrapperDiv = <HTMLDivElement>document.getElementById('root');
    const requestIDs: string[] = [];
    let saveGame: string | undefined = undefined;

    const resetButton = <HTMLButtonElement>document.getElementById('reset');
    resetButton.addEventListener('click', () => {
        backend.clearTimeouts();
        backend = newGame(saveGame);
    });

    const bossKillButton = <HTMLButtonElement>document.getElementById('bossKill');
    bossKillButton.addEventListener('click', () => backend.bossKill() );

    function newGame(savedGame?: string) {
        return new Backend(
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
                defaultBossEmoticonURL: '',
                defaultBossMessage: 'yo, tim! how\'re you doin\'??',
                defaultChampion: {
                    id: '-1',
                    name: 'ravi II',
                    amount: 1000,
                    profileImageURL: 'testbed_images/banana_icon.png',
                    bossMessage: 'look at me',
                    bossEmoticonURL: 'emoticon url here',
                    bitBossCheerMote: true
                },
                characterNames: {
                    'Scullery Maid': 'Scullery Maid mII',
                    'Mage': 'Mage mII'
                },
                characterArt: {},
                bitFighterEnabled: true,
                bitBossStartingHealth: 750,
                assetPathPrefix: 'shim_test/',
                frontendSettings: {
                    bitBossPosition: {
                        x: 40,
                        y: 10,
                        scale: 1
                    },
                    bitFighterPosition: {
                        x: 10,
                        y: 20,
                        scale: 3
                    },
                    cardsTimeout: 60000
                }
            },
            str => saveGame = str,
            (gameState, donationType, amount) => {
                console.log(`donation: ${ gameState }, ${ donationType }, ${ amount }`);
            },
            saveGame
        );
    }
    
    let backend = newGame();

    const frontend = new Frontend(
        wrapperDiv,
        (slug, message) => {
            window.setTimeout(() => {
                console.log('message, front to back:', message);
                let id = '-1';
                if (message.characterChoice !== undefined)
                    id = requestIDs.shift() || '-1';
    
                backend.receivedFanGameState(id, message);
            }, 0);
        }
    );

    const newDonationButton = <HTMLButtonElement>document.getElementById('new-donation');
    const nameInputNode = <HTMLInputElement>document.getElementById('donation-name');
    const idInputNode = <HTMLInputElement>document.getElementById('donation-id');
    const bitsInputNode = <HTMLInputElement>document.getElementById('donation-bits');
    const emoteInputNode = <HTMLInputElement>document.getElementById('bitboss-emote');
    newDonationButton.addEventListener('click', element => {
        const id = idInputNode.value;
        const name = nameInputNode.value;
        const amount = Number(bitsInputNode.value);
        const emote = emoteInputNode.checked;

        idInputNode.value = String(id + 1);

        backend.donation(
            id,
            name,
            amount,
            'todo: url goes here',
            'how\'re you doin\'?',
            'todo: emoticon url goes here',
            emote
        );
    });
});
