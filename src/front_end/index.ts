import * as Display from './Display';
import { Message } from '../shared/frontEndMessage';

document.addEventListener("DOMContentLoaded", function(){
    let textOut = <HTMLDivElement>document.getElementById('text-out');

    let display = new Display.Display;

    window.addEventListener('storage', (e) => {
        console.log(e)
        switch(e.key) {
            case 'fight':
                let str = e.newValue;
                if (str == undefined) {
                    console.error('bad storage event value');
                    break;
                }
                display.newReel(<Message>JSON.parse(str));
                break;
            default:
                console.error('unidentified storage event');
        }
    });
});
