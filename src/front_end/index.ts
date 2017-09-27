import { BitFighter } from './BitFighter';
import {BackToFrontMessage, FrontToBackMessage, CharacterChoice, FrontEndSettings as Settings } from '../shared/frontEndMessage';

window.addEventListener('load', function(){
    const wrapperDiv = <HTMLDivElement>document.getElementById('bitfighter');

    const bifFighter = new BitFighter(
        wrapperDiv,
        {
            position: {
                x: 10,
                y: 40
            },
            size: 1,
        },
        (slug, message) => {
            localStorage.setItem('frontToBack', JSON.stringify(message));
        }
    );


    window.addEventListener('storage', (e) => {
        console.log(e)
        const str = e.newValue;
        if (str == undefined) {
            console.error('bad storage event value');
            return;
        }
        switch(e.key) {
            case 'backToFront':
                const data = <BackToFrontMessage>JSON.parse(str);
                console.log(data);
                bifFighter.recievedViewerGameState(data);
            case 'frontToBack':
                break;
            default:
                console.error('unidentified storage event');
        }
    });
<<<<<<< HEAD

    const test = <HTMLButtonElement>document.getElementById('test');
    test.addEventListener('click', () => {
        let x = <HTMLInputElement>document.getElementById('scale');
        if (x.value)
            gameState.setNewScale(Number(x.value));
    });

    function characterChoice(choice: number) {
        const characterChoice: CharacterChoice = { choice };
        localStorage.setItem('choiceResult', JSON.stringify(characterChoice));
    }
  
    changeImage();
=======
>>>>>>> 3e14c7ff835919784c301ce7756545d801d45b4a
});
