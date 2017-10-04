import { BitFighter } from './BitFighter';
import {BackToFrontMessage, FrontToBackMessage, CharacterChoice, FrontEndSettings as Settings } from '../shared/frontEndMessage';

// keith stuff goes here
declare function emitGameEvent(slug: string, data: FrontToBackMessage) : void;
declare let window: any;

// document.addEventListener('DOMContentLoaded', ()=>{
const wrapperDiv = <HTMLDivElement>document.getElementById('bitfighter');

window.bitFighter = new BitFighter(
    wrapperDiv,
    {
        position: {
            x: 10,
            y: 40
        },
        size: 1,
        cardsTimeout: 60000,
        assetsShim: 'mini-games/bitFighter/'
    },
    (slug, message) => {
        emitGameEvent(slug, message);
    }
);

// })
