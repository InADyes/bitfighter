import 'fabric'
declare let fabric: any;
import * as Display from './Display';
import { Message } from '../shared/frontEndMessage';
import * as Reel from '../shared/displayReel'




document.addEventListener("DOMContentLoaded", function(){
    let gameState = new Display.GameState;
    let currentTarget = <HTMLInputElement>document.getElementById("left");
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

    window.addEventListener('storage', (e) => {
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
        /* move this to Display.ts
        Say something like "g.healthBar"
         g.healthbar.animate('width','-=10', {
            duration: 200,
            onChange: g.canvas.renderAll.bind(g.canvas),
        });*/
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
        /*move this to Display.ts
        Say something like "g.p1Dies()" and "g.p2Dies()"
        g.p1.animate('angle','90',{
            duration: 1000,
            onChange: g.canvas.renderAll.bind(g.canvas),
            onComplete: function() {
                g.canvas.remove(g.p1);
                g.canvas.remove(g.healthbar);
                //g.canvas.remove(healthbar1Mis);
            }
        })*/
    });
    let text = <HTMLDivElement>document.getElementById("text");
    text.addEventListener("click", function() {
        console.log("display text over a player's head");
        if (currentTarget.checked)
            g.p1Damage();
        else
            g.p2Damage();
        /* move this to Display.ts
        say something like "g.text()"
        let dmg = new fabric.Text('20',{
            fontSize: 30,
            fill: 'yellow',
            top: 100,
            left: 100
        });
        
        g.canvas.add(dmg);
        dmg.animate('top', '-=50',{
            duration: 500,
            onChange: g.canvas.renderAll.bind(g.canvas),
            onComplete: function(){
                g.canvas.remove(dmg);
            }
        });*/
    });
}
});