import 'fabric'
declare let fabric: any;
import * as Display from './Display';
import { Message } from '../shared/frontEndMessage';
import * as Reel from '../shared/displayReel'

document.addEventListener("DOMContentLoaded", function(){
    let gameState = new Display.GameState();

    //////////////// TEMPORARY STUFF /////////////////
    let message = {
        characters: [{
            name: "hao",
            hitPoints: 1000,
            art: Display.Art.axe,
        },{
            name: "max",
            hitPoints: 1000,
            art: Display.Art.daggers,
        }],
        "reel":[
        {"time":1413,"type":1,"character":0},
        {"time":1563,"type":3,"character":1,"text":"dodge","color":"orange"},
        {"time":2193,"type":3,"character":0,"text":"crit","color":"red"},
        {"time":2745,"type":1,"character":0},
        {"time":2895,"type":0,"character":1,"health":-17},
        {"time":2895,"type":3,"character":1,"text":"17","color":"red"},
        {"time":3349,"type":1,"character":1},
        {"time":3499,"type":3,"character":0,"text":"dodge","color":"orange"},
        {"time":4476,"type":3,"character":1,"text":"crit","color":"red"},
        {"time":4750,"type":1,"character":1},
        {"time":4900,"type":0,"character":0,"health":-20},
        {"time":4900,"type":3,"character":0,"text":"20","color":"red"},
        {"time":5648,"type":3,"character":1,"text":"crit","color":"red"},
        {"time":6357,"type":1,"character":1},
        {"time":6507,"type":3,"character":0,"text":"dodge","color":"orange"},
        {"time":6612,"type":1,"character":0},
        {"time":6762,"type":3,"character":1,"text":"dodge","color":"orange"},
        {"time":8000,"type":3,"character":0,"text":"crit","color":"red"},
        {"time":8000,"type":3,"character":0,"text":"crit","color":"red"},
        {"time":9151,"type":1,"character":0},
        {"time":9301,"type":3,"character":1,"text":"dodge","color":"orange"},
        {"time":9577,"type":3,"character":0,"text":"crit","color":"red"},
        {"time":10817,"type":1,"character":0},
        {"time":10967,"type":3,"character":1,"text":"dodge","color":"orange"},
        {"time":11261,"type":3,"character":0,"text":"crit","color":"red"},
        {"time":12524,"type":1,"character":0},
        {"time":12674,"type":3,"character":1,"text":"dodge","color":"orange"},
        {"time":12857,"type":1,"character":1},{"time":13007,"type":3,"character":0,"text":"dodge","color":"orange"},{"time":13988,"type":1,"character":0},{"time":14138,"type":3,"character":1,"text":"dodge","color":"orange"},{"time":14591,"type":1,"character":1},{"time":14741,"type":3,"character":0,"text":"dodge","color":"orange"},{"time":15008,"type":1,"character":0},{"time":15158,"type":3,"character":1,"text":"dodge","color":"orange"},{"time":15763,"type":1,"character":1},{"time":15913,"type":3,"character":0,"text":"dodge","color":"orange"},{"time":16511,"type":1,"character":0},{"time":16661,"type":3,"character":1,"text":"dodge","color":"orange"},{"time":17379,"type":1,"character":1},{"time":17529,"type":0,"character":0,"health":-21},{"time":17529,"type":3,"character":0,"text":"21","color":"red"},{"time":18253,"type":3,"character":1,"text":"crit","color":"red"},{"time":18687,"type":3,"character":0,"text":"crit","color":"red"},{"time":19519,"type":3,"character":1,"text":"crit","color":"red"},{"time":19708,"type":3,"character":0,"text":"crit","color":"red"},{"time":20629,"type":3,"character":1,"text":"crit","color":"red"},{"time":20968,"type":1,"character":1},{"time":21118,"type":3,"character":0,"text":"dodge","color":"orange"},{"time":22000,"type":1,"character":0},{"time":22150,"type":3,"character":1,"text":"dodge","color":"orange"},{"time":22210,"type":1,"character":1},{"time":22360,"type":3,"character":0,"text":"dodge","color":"orange"},{"time":23533,"type":1,"character":1},{"time":23627,"type":3,"character":1,"text":"crit","color":"red"},{"time":23683,"type":3,"character":0,"text":"dodge","color":"orange"},{"time":24876,"type":1,"character":0},{"time":25026,"type":0,"character":1,"health":-30},{"time":25026,"type":3,"character":1,"text":"30","color":"red"},{"time":25238,"type":3,"character":0,"text":"crit","color":"red"},{"time":25238,"type":2,"character":0}]}
    };
    gameState.message = message;
    eventListeners(gameState, gameState.message);
    let currentTarget = <HTMLInputElement>document.getElementById("left");
    //////////////////////////////////////////////////

    gameState.initPlayers();

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


    // TEMPORARY BUTTONS. DELETE ALL THIS LATER ///////////////////////
    function eventListeners(g: Display.GameState, message: any) {
        let draw = <HTMLButtonElement>document.getElementById("draw");
        draw.addEventListener("click", function() {
             g.drawPlayers();
        });

        let health = <HTMLButtonElement>document.getElementById("health");
        health.addEventListener("click", function() {

            console.log("change a player's health");
            if (currentTarget.checked)
                g.player1.healthbar();
            else
                g.player2.healthbar();
        });

        let attack = <HTMLButtonElement>document.getElementById("attack");
        attack.addEventListener("click", function() {
            console.log((currentTarget.checked ? "p1" : "p2") + " attacks");
            if (currentTarget.checked)
                g.player1.attacks();
            else
                g.player2.attacks();
        });
        let clear = <HTMLDivElement>document.getElementById("clear");
        clear.addEventListener("click", function() {
            console.log("remove a player from the screen");
            if (currentTarget.checked)
                g.player1.dies();
            else
                g.player2.dies();
        });
        let text = <HTMLDivElement>document.getElementById("text");
        text.addEventListener("click", function() {
            console.log("display text over a player's head");
            if (currentTarget.checked)
                g.player1.damage();
            else
                g.player2.damage();
        });
    }
    /////////////////////////////////////////////////////////////////
});

