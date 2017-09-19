import * as Reel from '../shared/displayReel';
import { Message } from '../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;

export class Display {
    public newReel(message: Message) {
        console.log('new reel:', message);
    }
}

export class GameState {
	public	canvas:	fabric.Canvas;
	private img1:	HTMLImageElement;
	private img2:	HTMLImageElement;
	private p1:		fabric.Image;
	private p2:		fabric.Image;
	private healthbar1Curr: fabric.Rect;
	private healthbar2Curr: fabric.Rect;

	private art = [
	    "images/characters/axe.png",
 		"images/characters/sword.png",
	   	"images/characters/daggers.png",
    	"images/characters/champion_alpha.png",
	]

	constructor() {
		this.canvas =	new fabric.Canvas('arena'); // USE StaticCanvas for noninteractive
		this.img1 =		new Image();
		this.img2 =		new Image();
	}

	public setArt(i: number, player: number) {
		if (player == 1)
			this.img1.src = this.art[i];
		else
			this.img2.src = this.art[i];
	}

	public drawPlayers (message: any) {
        console.log("drawing players");
        if (this.p1)
            this.canvas.remove(this.p1);
        if (this.p2)
            this.canvas.remove(this.p2);
        this.setArt(message.characters[0].art, 1)
        this.p1 = new fabric.Image(this.img1, {
            left: 30,
            top: 100,
        });
        this.p1.scaleToWidth(200);
        this.canvas.add(this.p1);

       this.healthbar1Curr = new fabric.Rect({
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






        this.setArt(message.characters[1].art, 2);
        this.p2 = new fabric.Image(this.img2, {
            left: 350,
            top: 100,
            flipX: true,
        });
        this.p2.scaleToWidth(200);
        this.canvas.add(this.p2);
    }

	public p1Attacks () {
		let g = this;
	    g.p1.animate('left', '-=20', {
	        duration: 250,
	        onChange: g.canvas.renderAll.bind(g.canvas),
	        easing: fabric.util.ease['easeOutQuad'],
	        onComplete: function() {
        		g.p1.animate('left', '+=120', {
	                duration: 100,
	                easing: fabric.util.ease['easeInQuint'],
	                onChange: g.canvas.renderAll.bind(g.canvas),
	                onComplete: function () {
	                    g.p1.animate('left', 30, {
	                        duration: 200,
	                        onChange: g.canvas.renderAll.bind(g.canvas),
	                        easing: fabric.util.ease['easeOutQuint'],
	                	})
	                }
                });
	        }
	    });
	}
	public p2Attacks () {
		let g = this;
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
}

// until we get taras' art i guess
export const enum Art {
	axe,
	sword,
	daggers,
	champion,
}
