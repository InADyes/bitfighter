import 'fabric'
declare let fabric: any;
import * as Display from './Display';
import { Message } from '../shared/frontEndMessage';


let player1 = {
    name: "hao",
    hitPoints: 1000,
    art: "images/characters/sword.png",
    side: 0,
},
    player2 = {
    name: "max",
    hitPoints: 1000,
    art: "images/characters/axe.png",
    side: 1,
};


document.addEventListener("DOMContentLoaded", function(){
    let gameState = new Display.gameState;
    eventListeners(gameState);

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
});

function eventListeners(g: Display.gameState) {
    let draw1 = <HTMLButtonElement>document.getElementById("draw1");
    draw1.addEventListener("click", function() {
        console.log("draw player 1");
        if (g.p1 != null)
            g.canvas.remove(g.p1);
        g.img1.src = player1.art;
        g.p1 = new fabric.Image(g.img1, {
            left: 100,
            top: 200,
            originX: 'center',
            originY: 'center',
        });
        g.p1.scaleToWidth(200);
        let healthbar1Curr = new fabric.Rect({
            left: 50,
            top: 350,
            fill: 'green',
            height: 10,
            width: player1.hitPoints/10,
        });
        g.healthbar = healthbar1Curr;
        let healthbar1Mis = new fabric.Rect({
            left: 50,
            top: 350,
            fill: 'red',
            height: 10,
            width: player1.hitPoints/10,
        });
        g.canvas.add(g.p1);
        g.canvas.add(healthbar1Mis);
        g.canvas.add(healthbar1Curr);
    });

    let draw2 = <HTMLButtonElement>document.getElementById("draw2");
    draw2.addEventListener("click", function() {
        console.log("draw player 2");
        if (g.p2)
            g.canvas.remove(g.p2);
        g.img2.src = player2.art;
        g.p2 = new fabric.Image(g.img2, {
            left: 350,
            top: 100,
            flipX: true,
        });
        g.p2.scaleToWidth(200);
        g.canvas.add(g.p2);
    });

    let health = <HTMLButtonElement>document.getElementById("health");
    health.addEventListener("click", function() {
        console.log("change a player's health");
        g.healthbar.animate('width','-=10', {
            duration: 200,
            onChange: g.canvas.renderAll.bind(g.canvas),
        });
    });

    let attack = <HTMLButtonElement>document.getElementById("attack");
    attack.addEventListener("click", function() {
        let left = <HTMLInputElement>document.getElementById("left");
        console.log((left.checked ? "p1" : "p2") + " attacks");
        if (left.checked)
            p1Attacks(g);
        else
            p2Attacks(g);
    });
    let clear = <HTMLDivElement>document.getElementById("clear");
    clear.addEventListener("click", function() {
        console.log("remove a player from the screen");
        g.p1.animate('angle','90',{
            duration: 1000,
            onChange: g.canvas.renderAll.bind(g.canvas),
            onComplete: function() {
                g.canvas.remove(g.p1);
                g.canvas.remove(g.healthbar);
                //g.canvas.remove(healthbar1Mis);
            }
        })
    });
    let text = <HTMLDivElement>document.getElementById("text");
    text.addEventListener("click", function() {
        console.log("display text over a player's head");

        let dmg = new fabric.Text('20',{
            fontSize: 30,
            fill: 'red',
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
        });

    });
}

function p1Attacks (g: Display.gameState) {
    g.p1.animate('left', '-=20', {
        duration: 250,
        onChange: g.canvas.renderAll.bind(g.canvas),
        easing: fabric.util.ease['easeOutQuad'],
        onComplete: function () {
            g.p1.animate('left', '+=120', {
                duration: 100,
                easing: fabric.util.ease['easeInQuint'],
                onChange: g.canvas.renderAll.bind(g.canvas),
                onComplete: function () {
                    g.p1.animate('left', 100, {
                        duration: 200,
                        onChange: g.canvas.renderAll.bind(g.canvas),
                        easing: fabric.util.ease['easeOutQuint'],
                    })
                }
            });
        }
    });
}

function p2Attacks (g: Display.gameState) {
    g.p2.animate('left', '+=20', {
        duration: 250,
        onChange: g.canvas.renderAll.bind(g.canvas),
        easing: fabric.util.ease['easeOutQuad'],
        onComplete: function () {
            g.p2.animate('left', '-=120', {
                duration: 100,
                easing: fabric.util.ease['easeInQuint'],
                onChange: g.canvas.renderAll.bind(g.canvas),
                onComplete: function () {
                    g.p2.animate('left', 350, {
                        duration: 200,
                        onChange: g.canvas.renderAll.bind(g.canvas),
                        easing: fabric.util.ease['easeOutQuint'],
                    })
                }
            });
        }
    });

}
