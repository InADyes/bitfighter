import * as Reel from '../shared/displayReel';
import { Message } from '../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;

export class Display {
    public newReel(message: Message) {
        console.log('new reel:', message);
    }
}
export class Combatant {
	private img:				fabric.Object;
	private healthbarCurr:	fabric.Rect;
	private healthbarMis:	fabric.Rect;
	private art = [
	    "images/characters/axe.png",
 		"images/characters/sword.png",
	   	"images/characters/daggers.png",
    	"images/characters/champion_alpha.png",
	]

	constructor() {

	}

	public draw() {

	}

	public attacks() {

	}

	public dies() {

	}

	public damage() {

	}

	public healthbar() {

	}
}

export class GameState {
	public	canvas:			fabric.Canvas;
	public	message:		any;


	constructor() {
		this.message =			message;
		this.canvas =			new fabric.Canvas('arena'); // USE StaticCanvas for noninteractive
		this.healthbar1Curr = 	new fabric.Rect({
            left: 50,
            top: 350,
            fill: 'green',
            height: 10,
            width: 100
        });
        this.healthbar1Mis = 	new fabric.Rect({
            left: 50,
            top: 350,
            fill: 'red',
            height: 10,
            width: 100
		});
		this.healthbar2Curr = 	new fabric.Rect({
            left: 370,
            top: 350,
            fill: 'green',
            height: 10,
            width: 100
        });
        this.healthbar2Mis = 	new fabric.Rect({
            left: 370,
            top: 350,
            fill: 'red',
            height: 10,
            width: 100
		});
	}

	public drawPlayers () {
        console.log("drawing players");
		if (this.p1)
            this.canvas.remove(this.p1);
        if (this.p2)
            this.canvas.remove(this.p2);
		new fabric.Image.fromURL(this.art[this.message.characters[0].art], (oImg: fabric.Image) => {
			this.p1 = oImg.set({
				left: 150,
				top: 300,
				originX: 'center',
				originY: 'bottom'
			});
			this.p1.scaleToWidth(200);
			this.canvas.add(this.p1);
		});
		new fabric.Image.fromURL(this.art[this.message.characters[1].art], (oImg: fabric.Image) => {
			this.p2 = oImg.set({
				left: 420,
				top: 300,
				originX: 'center',
				originY: 'bottom',
				flipX: true
			});
			this.p2.scaleToWidth(200);
			this.canvas.add(this.p2);
		});

        // Draw the health bars
		if (this.healthbar1Curr)
            this.canvas.remove(this.healthbar1Curr);
        if (this.healthbar2Curr)
			this.canvas.remove(this.healthbar2Curr);
		if (this.healthbar1Mis)
            this.canvas.remove(this.healthbar1Mis);
        if (this.healthbar2Mis)
            this.canvas.remove(this.healthbar2Mis);
        this.canvas.add(this.healthbar1Mis);
		this.canvas.add(this.healthbar1Curr);
		this.canvas.add(this.healthbar2Mis);
        this.canvas.add(this.healthbar2Curr);
        this.canvas.renderAll();
	}

	public p1Attacks () {
	    this.p1.animate('left', '-=20', {
	        duration: 250,
	        onChange: this.canvas.renderAll.bind(this.canvas),
	        easing: fabric.util.ease['easeOutQuad'],
	        onComplete: () => {
        		this.p1.animate('left', '+=120', {
	                duration: 100,
	                easing: fabric.util.ease['easeInQuint'],
	                onChange: this.canvas.renderAll.bind(this.canvas),
	                onComplete: () => {
	                    this.p1.animate('left', 150, {
	                        duration: 200,
	                        onChange: this.canvas.renderAll.bind(this.canvas),
	                        easing: fabric.util.ease['easeOutQuint'],
	                	})
	                }
                });
	        }
	    });
	}
	public p2Attacks () {
	    this.p2.animate('left', '+=20', {
	        duration: 250,
	        onChange: this.canvas.renderAll.bind(this.canvas),
	        easing: fabric.util.ease['easeOutQuad'],
	        onComplete: () => {
	            this.p2.animate('left', '-=120', {
	                duration: 100,
	                easing: fabric.util.ease['easeInQuint'],
	                onChange: this.canvas.renderAll.bind(this.canvas),
	                onComplete: () => {
	                    this.p2.animate('left', 420, {
	                        duration: 200,
	                        onChange: this.canvas.renderAll.bind(this.canvas),
	                        easing: fabric.util.ease['easeOutQuint'],
	                    })
	                }
	            });
	        }
	    });
	}
	public p1Death(){
		this.p1.animate('angle','90',{
            duration: 700,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
				this.p1.animate('opacity', 0,{
					duration: 200,
					onChange: this.canvas.renderAll.bind(this.canvas),
					onComplete: () => {
						this.canvas.remove(this.p1);
						this.canvas.remove(this.healthbar1Curr);
						this.canvas.remove(this.healthbar1Mis);
					} 
				});
            }
        });
	}
	public p2Death(){
		this.p2.animate('angle','-90',{
            duration: 700,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.p2.animate('opacity', 0,{
					duration: 200,
					onChange: this.canvas.renderAll.bind(this.canvas),
					onComplete: () => {
						this.canvas.remove(this.p2);
						this.canvas.remove(this.healthbar2Curr);
						this.canvas.remove(this.healthbar2Mis);
					} 
				});
            }
        });
	}
	public p1Damage(){
		let dmg = new fabric.Text('20',{
            fontSize: 30,
            fill: 'red',
            top: 100,
            left: 100
        });
        
        this.canvas.add(dmg);
        dmg.animate('top', '-=50',{
            duration: 500,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.canvas.remove(dmg);
            }
        });

	}

	public p2Damage(){
		let dmg = new fabric.Text('20',{
            fontSize: 30,
            fill: 'red',
            top: 100,
            left: 420
        });
        
        this.canvas.add(dmg);
        dmg.animate('top', '-=50',{
            duration: 500,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.canvas.remove(dmg);
            }
        });
	}
	public p1healthbarChange(){
		this.healthbar1Curr.animate('width','-=10', {
            duration: 200,
            onChange: this.canvas.renderAll.bind(this.canvas),
        });
	}
	public p2healthbarChange(){
		this.healthbar2Curr.animate('width','-=10', {
            duration: 200,
            onChange: this.canvas.renderAll.bind(this.canvas),
        });
	}
}

function sleep(duration: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	})
}

// until we get taras' art i guess
export const enum Art {
	axe,
	sword,
	daggers,
	champion,
}

export const enum Side {
	player1,
	player2,
}
