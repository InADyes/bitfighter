import 'fabric'

declare let fabric: any;

/*document.addEventListener("DOMContentLoaded", function(){
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
*/
document.addEventListener("DOMContentLoaded", function () {
    let canvas = new fabric.Canvas("arena-front");
    let moveleftButton = <HTMLButtonElement>document.getElementById('left');
    let moverightButton = <HTMLButtonElement>document.getElementById('right');
    let rect = new fabric.Rect();
    //rect.set({ width: 10, height: 20, fill: '#f55', opacity: 0.7 });
    //canvas.add(rect);
    // fabric.Image.fromURL('images/characters/axe.png', function(oImg:object){
    //     oImg.animate
    //     canvas.add(oImg);
    // });
    if (moveleftButton == null || moverightButton == null) {
        console.log('f**k u');
    }
    let imgElement1 = document.getElementById('my-image');
    let imgElement2 = document.getElementById('your-image');


    let imgInstance1 = new fabric.Image(imgElement1, {
        left: 200,
        top: 100,
        angle: 0,
        opacity: 0.85,
        flipX: true
    });
    let imgInstance2 = new fabric.Image(imgElement1, {
        left: 50,
        top: 100,
        angle: 0,
        opacity: 0.85
    })

    canvas.add(imgInstance1);
    canvas.add(imgInstance2);

    function animateleftcharacter(obj: fabric.Image){
        obj.animate('left', '-=10',{

        })

    }

    moveleftButton.addEventListener('click', function (element){

        imgInstance1.animate('left', '-=10', {
            onChange: canvas.renderAll.bind(canvas),
            duration: 1000,
            easing: fabric.util.ease.easeOutBounce
        });
        imgInstance2.animate('left', '+=10', {
            onChange: canvas.renderAll.bind(canvas),
            duration: 1000,
            easing: fabric.util.ease.easeOutBounce
        });

        //   });
        setTimeout(function() {
            
        }, 1000);

        //moverightButton.addEventListener('click', function(element){
        //imgInstance1.animate('left', '+=50', {onChange: canvas.renderAll.bind(canvas)});
        //canvas.add(imgInstance1); 
        imgInstance1.animate('left', '+=10', {
            onChange: canvas.renderAll.bind(canvas),
            duration: 1000,
            easing: fabric.util.ease.easeOutBounce
        });
        imgInstance2.animate('left', '-=10', {
            onChange: canvas.renderAll.bind(canvas),
            duration: 1000,
            easing: fabric.util.ease.easeOutBounce
        });
        // });
    });
    //window.requestAnimationFrame(ani);
});