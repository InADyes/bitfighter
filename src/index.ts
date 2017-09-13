import * as Game from './Game';

document.addEventListener("DOMContentLoaded", function(){
    let arenaFront = <HTMLCanvasElement>document.getElementById("arena-front");
    let arenaBack = <HTMLCanvasElement>document.getElementById("arena-front");
    let arenaThird = <HTMLCanvasElement>document.getElementById("arena-third");
    if (arenaFront == null || arenaBack == null) {
        console.error("missing DOM hook");
        return;
    }
    let game = new Game.Game(arenaFront, arenaBack);

    window.addEventListener('storage', (e) => {
       // console.log(e)
        switch(e.key) {
            case 'gamemodel':
                let Gamemodel = Number(e.newValue);
                if (Gamemodel == undefined){ 
                    console.error('bad storage event value');
                    break;
                }
                console.log(Gamemodel);
                
                break;
            default:
                //console.error('unidentified storage event');
                return;
        }
    });
    
    switch(Number(localStorage.getItem("gamemodel"))){
        case 1:
            game = new Game.Game(arenaFront, arenaBack);
            break;
        case 2:
            game = new Game.Game(arenaBack, arenaBack);
            break;
        case 3:
            game = new Game.Game(arenaThird, arenaBack);
            break;
    }
    
    
    //let game = new Game.Game(arenaFront, arenaBack);
    game.seed(100);
    game.tick(performance.now());
    window.addEventListener('storage', (e) => {
        //console.log(e)
        switch(e.key) {
            case 'donation':
                let str = e.newValue;
                if (str == undefined) {
                    console.error('bad storage event value');
                    break;
                }
                game.donate(JSON.parse(str));
                break;
            default:
                //console.error('unidentified storage event');
                return;
        }
    });
});