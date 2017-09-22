import 'fabric'
declare let fabric: any;
import * as Display from './modules/Gamestate';
import { Message } from '../shared/frontEndMessage';

document.addEventListener("DOMContentLoaded", function(){
    let gameState = new Display.GameState(`arena`);
    
    window.addEventListener('storage', (e) => {
        console.log(e)
        const str = e.newValue;
        if (str == undefined) {
            console.error('bad storage event value');
            return;
        }
        switch(e.key) {
            case 'fight':
                let message = <Message>JSON.parse(str);
                console.log(message.reel);
                gameState.newMessage(message.reel, message.patch);
                gameState.initPlayers(message.characters);
                break;
            case 'characterChoice':
                //console.log(JSON.parse())
                break;
            case 'choiceResult':
                break;
            default:
                console.error('unidentified storage event');
        }
    });
});