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
	private healthbar1Mis: fabric.Rect;
	private healthbar2Curr: fabric.Rect;
	private healthbar2Mis: fabric.Rect;

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
		this.healthbar1Curr = new fabric.Rect({
            left: 50,
            top: 350,
            fill: 'green',
            height: 10,
            width: 100
        });
        this.healthbar1Mis = new fabric.Rect({
            left: 50,
            top: 350,
            fill: 'red',
            height: 10,
            width: 100
		});
		this.healthbar2Curr = new fabric.Rect({
            left: 370,
            top: 350,
            fill: 'green',
            height: 10,
            width: 100
        });
        this.healthbar2Mis = new fabric.Rect({
            left: 370,
            top: 350,
            fill: 'red',
            height: 10,
            width: 100
		});
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
            left: 100,
			top: 300,
			originX: 'center',
			originY: 'bottom'
        });
        this.p1.scaleToWidth(200);
        this.canvas.add(this.p1);

		this.setArt(message.characters[1].art, 2);
        this.p2 = new fabric.Image(this.img2, {
            left: 420,
            top: 300,
			flipX: true,
			originX: 'center',
			originY: 'bottom'
        });
        this.p2.scaleToWidth(200);
        this.canvas.add(this.p2);
        this.canvas.add(this.healthbar1Mis);
		this.canvas.add(this.healthbar1Curr);
		this.canvas.add(this.healthbar2Mis);
        this.canvas.add(this.healthbar2Curr);
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
	                    g.p2.animate('left', 420, {
	                        duration: 200,
	                        onChange: g.canvas.renderAll.bind(g.canvas),
	                        easing: fabric.util.ease['easeOutQuint'],
	                    })
	                }
	            });
	        }
	    });
	}
	public p1Death(){
		let g = this;
		g.p1.animate('angle','90',{
            duration: 1000,
            onChange: g.canvas.renderAll.bind(g.canvas),
            onComplete: function() {
                g.canvas.remove(g.p1);
				g.canvas.remove(g.healthbar1Curr);
				g.canvas.remove(g.healthbar1Mis);
                //g.canvas.remove(healthbar1Mis);
            }
        });
	}
	public p2Death(){
		let g = this;
		g.p2.animate('angle','-90',{
            duration: 1000,
            onChange: g.canvas.renderAll.bind(g.canvas),
            onComplete: function() {
                g.canvas.remove(g.p2);
				g.canvas.remove(g.healthbar2Curr);
				g.canvas.remove(g.healthbar2Mis);
                //g.canvas.remove(healthbar1Mis);
            }
        });
	}
	public p1Damage(){
		let g = this;
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

	}

	public p2Damage(){
		let g = this;
		let dmg = new fabric.Text('20',{
            fontSize: 30,
            fill: 'red',
            top: 100,
            left: 420
        });
        
        g.canvas.add(dmg);
        dmg.animate('top', '-=50',{
            duration: 500,
            onChange: g.canvas.renderAll.bind(g.canvas),
            onComplete: function(){
                g.canvas.remove(dmg);
            }
        });
	}
	public p1healthbarChange(){
		let g = this;
		g.healthbar1Curr.animate('width','-=10', {
            duration: 200,
            onChange: g.canvas.renderAll.bind(g.canvas),
        });
	}
	public p2healthbarChange(){
		let g = this;
		g.healthbar2Curr.animate('width','-=10', {
            duration: 200,
            onChange: g.canvas.renderAll.bind(g.canvas),
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
