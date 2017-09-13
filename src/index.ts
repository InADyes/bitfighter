import * as Game from './Game';
import * as fabric from 'fabric';

document.addEventListener("DOMContentLoaded", function(){
    let arenaFront = <HTMLCanvasElement>document.getElementById("arena-front");
    let arenaBack = <HTMLCanvasElement>document.getElementById("arena-front");
    let arenaWrapper = <HTMLDivElement>document.getElementById("arena-wrapper");
    let scaleratio = 1;
    if (arenaFront == null || arenaBack == null) {
        console.error("missing DOM hook");
        return;
    }
    let devicePixelRatio = window.devicePixelRatio || 1;
    
    if(arenaWrapper.style.width == null)
        return;
    let widthnumber = 300;
    
    var abcde = new fabric.Canvas('arena-front');
    fabric.Image.fromURL('dist/images.characters.axe.png', function(oImg){
        abcde.add(oImg);
    });
    
    let ctx = arenaFront.getContext('2d');
    
    window.addEventListener("mouseover", function(){
        if(arenaWrapper.style.width == null)
            return;
        
        scaleratio = devicePixelRatio*(Number(arenaWrapper.style.width.replace(/[^\d\.\-]/g, '')))/300;
       
        arenaFront.width = arenaFront.clientWidth * Math.sqrt(scaleratio);
        arenaFront.height = arenaFront.clientHeight * Math.sqrt(scaleratio);

        if(ctx == null)
            return;
        ctx.scale(scaleratio, scaleratio);

        console.log(String(Number(arenaWrapper.style.width.replace(/[^\d\.\-]/g, ''))));
        console.log(String(widthnumber));
        console.log(String(scaleratio));
        
    })
    
    //console.log(String(scaleratio));
    

    let game = new Game.Game(abcde, arenaBack);
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
