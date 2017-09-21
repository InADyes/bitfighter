import 'fabric'
declare let fabric: any;
import * as Display from './Display';
import { Message } from '../shared/frontEndMessage';
//import * as Reel from '../shared/graphicsEvents'

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
    //////////////// TEMPORARY STUFF /////////////////
    
    eventListeners(gameState); // wont work
    let currentTarget = <HTMLInputElement>document.getElementById("left");
    function eventListeners(g: Display.GameState) {
        let draw = <HTMLButtonElement>document.getElementById("draw");
        draw.addEventListener("click", function() {
             g.drawPlayers();
        });

        let health = <HTMLButtonElement>document.getElementById("health");
        let amount = <HTMLInputElement>document.getElementById("damage");
        health.addEventListener("click", function() {

            console.log("change a player's health");
            if (currentTarget.checked)
                g.changeHealth(0, Number(amount.value));
            else
                g.changeHealth(1, Number(amount.value));
        });

        let attack = <HTMLButtonElement>document.getElementById("attack");
        attack.addEventListener("click", function() {
            console.log((currentTarget.checked ? "p1" : "p2") + " attacks");
            if (currentTarget.checked)
                g.attack(0);
            else
                g.attack(1);
        });
        let clear = <HTMLDivElement>document.getElementById("clear");
        clear.addEventListener("click", function() {
            console.log("remove a player from the screen");
            if (currentTarget.checked)
                g.slay(0)
            else
                g.slay(1);
        });
        let text = <HTMLDivElement>document.getElementById("text");
        let t = text.innerText;
        text.addEventListener("click", function() {
            console.log("display text over a player's head");
            if (currentTarget.checked)
                g.displayText(0, t, `red`);
            else
                g.displayText(1, t, `red`);
        });
    }
    /////////////////////////////////////////////////////////////////
});

