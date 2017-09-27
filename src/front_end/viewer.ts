import { BitFighter } from './BitFighter';
import {BackToFrontMessage, FrontToBackMessage, CharacterChoice, FrontEndSettings as Settings } from '../shared/frontEndMessage';

// keith stuff goes here
declare function emitGameEvent(slug: string, data: FrontToBackMessage) : void;

let bitFighter: BitFighter;

function recievedViewerGameState(data: BackToFrontMessage) {
    // This function will get fired everytime there is a new viewer game state received
    // this will hold game state information relative to the viewer
    bitFighter.recievedViewerGameState(data);
}

document.addEventListener('DOMContentLoaded', function(){
    const wrapperDiv = <HTMLDivElement>document.getElementById('bitfighter');

     bitFighter = new BitFighter(
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
            emitGameEvent(slug, message);
        }
    );
});
