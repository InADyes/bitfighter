import 'fabric'
declare let fabric: any;
import * as Display from './Display';
import { Message } from '../shared/frontEndMessage';
import * as Reel from '../shared/displayReel'


let currentTarget = <HTMLInputElement>document.getElementById("left");


document.addEventListener("DOMContentLoaded", function(){
    let gameState = new Display.GameState;
    let message = {
        characters: [{
                name: "hao",
                hitPoints: 1000,
                art: Display.Art.axe,
            },{
                name: "max",
                hitPoints: 1000,
                art: Display.Art.daggers,
            }]
    };
    eventListeners(gameState, message);

    let textOut = <HTMLDivElement><HTMLDivElement>document.getElementById('text-out');

    let display = new Display.Display;

    /*window.addEventListener('storage', (e) => {
        console.log(e)
        switch(e.key) {
            case 'fight':
                let str = e.newValue;
                if (str == undefined) {
                    console.error('bad storage event value');
                    break;
                }
                console.log(str);
                display.newReel(<Message>JSON.parse(str));
                break;
            default:
                console.error('unidentified storage event');
        }
    });*/
});

function eventListeners(g: Display.GameState, message: any) {
    let draw = <HTMLButtonElement>document.getElementById("draw");
    draw.addEventListener("click", function() {
         g.drawPlayers(message);
         
    });

    let health = <HTMLButtonElement>document.getElementById("health");
    health.addEventListener("click", function() {
        console.log("change a player's health");
        if (currentTarget.checked)
            g.p1healthbarChange();
        else
            g.p2healthbarChange();
    });

    let attack = <HTMLButtonElement>document.getElementById("attack");
    attack.addEventListener("click", function() {
        //let left = <HTMLInputElement>document.getElementById("left");
        console.log((currentTarget.checked ? "p1" : "p2") + " attacks");
        if (currentTarget.checked)
            g.p1Attacks();
        else
            g.p2Attacks();
    });
    let clear = <HTMLDivElement>document.getElementById("clear");
    clear.addEventListener("click", function() {
        console.log("remove a player from the screen");
        if (currentTarget.checked)
            g.p1Death();
        else
            g.p2Death();
    });
    let text = <HTMLDivElement>document.getElementById("text");
    text.addEventListener("click", function() {
        console.log("display text over a player's head");
        if (currentTarget.checked)
            g.p1Damage();
        else
            g.p2Damage();
    });
}
});