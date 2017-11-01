import { BitFighter } from './front_end/BitFighter';
import { BackToFrontMessage } from './shared/interfaces/backToFrontMessage';
import { FrontToBackMessage, CharacterChoice } from './shared/interfaces/frontToBackMessage';

// keith stuff goes here
declare function emitGameEvent(slug: string, data: FrontToBackMessage) : void;
declare let window: any;

document.addEventListener('DOMContentLoaded', ()=>{
const wrapperDiv = <HTMLDivElement>document.getElementById('bitfighter');
//const cardDiv = <HTMLDivElement>document.getElementById('charSelect');

window.bitFighter = new BitFighter(
    wrapperDiv,
    {
        position: {
            x: 10,
            y: 40
        },
        size: 1,
        cardsTimeout: 60000,
        assetsShim: 'https://s3.amazonaws.com/bitfighter/'
    },
    (slug, message) => {
        emitGameEvent(slug, message);
    },
    //cardDiv
);

})
