import 'fabric'
declare let fabric: any;
import * as Display from './modules/Gamestate';
import { Message } from '../shared/frontEndMessage';

document.addEventListener("DOMContentLoaded", function(){
    let gameState = new Display.GameState();
    
    window.addEventListener('storage', (e) => {
        console.log(e)
        switch(e.key) {
            case 'fight':
                let str = e.newValue;
                if (str == undefined) {
                    console.error('bad storage event value');
                    break;
                }
                let message = <Message>JSON.parse(str);
                console.log(message.reel);
                gameState.newMessage(message.reel, message.patch);
                gameState.initPlayers(message.characters);
                break;
            default:
                console.error('unidentified storage event');
        }
    });
});