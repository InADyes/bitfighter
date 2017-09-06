import * as Game from './Game';

document.addEventListener("DOMContentLoaded", function(){
    let arenaFront = <HTMLCanvasElement>document.getElementById("arena-front");
    let arenaBack = <HTMLCanvasElement>document.getElementById("arena-front");
    if (arenaFront == null || arenaBack == null) {
        console.error("missing DOM hook");
        return;
    }
    let devicePixelRatio = window.devicePixelRatio || 1;

    arenaFront.width = arenaFront.clientWidth * devicePixelRatio;
    arenaFront.height = arenaFront.clientHeight * devicePixelRatio;
    let ctx = arenaFront.getContext('2d');
    if(ctx == null)
        return;
    ctx.scale(devicePixelRatio,devicePixelRatio);

    let game = new Game.Game(arenaFront, arenaBack);
    game.seed(100);
    game.tick(performance.now());
    window.addEventListener('storage', (e) => {
        console.log(e)
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
                console.error('unidentified storage event');
        }
    });
    game.donate({id: 1, name: "bob", amount: 100, art:2});
});
