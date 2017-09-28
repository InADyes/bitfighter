import { BitFighter } from '../front_end/BitFighter';
import { BackToFrontMessage, FrontToBackMessage, CharacterChoice, FrontEndSettings as Settings } from '../shared/frontEndMessage';

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
            cardsTimeout: 60000
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

    let x = <HTMLButtonElement>document.getElementById('addBuff');
    x.addEventListener("click", ()=> {
        let a = <HTMLInputElement>document.getElementById("duration");
        let b = <HTMLInputElement>document.getElementById("art");
        let c = <HTMLInputElement>document.getElementById("player");
        let duration = Number(a.value);
        let art = Number(b.value);
        let player = Number(c.value);
    
        bifFighter.addBuff(art, duration, player);
    });
});
