import * as Reel from '../shared/displayReel';
import { Message } from '../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;

export class Combatant {
	private	name:			string;
	private	health:			number;
	private	right:			number;
	private img:			fabric.Object;
	private healthbarCurr:	fabric.Rect;
	private healthbarMis:	fabric.Rect;
	private canvas:			fabric.Canvas;
	private art = [
		"images/characters/axe.png",
		"images/characters/sword.png",
		"images/characters/daggers.png",
		"images/characters/champion_alpha.png",
	]

	constructor(data: any, side: number, canvas: fabric.Canvas) {
		this.name = data.name;
		this.health = data.health;
		this.right = side;
		this.canvas = canvas;
	}

	public draw() {

		if (this.img)
			this.canvas.remove(this.img);
		new fabric.Image.fromURL(this.art[1], (oImg: fabric.Image) => {
			this.img = oImg.set({
				left: !this.right ? 150 : 420,
				top: 300,
				originX: 'center',
				originY: 'bottom',
				flipX: !this.right ? false : true
			});
			this.img.scaleToWidth(200);
			this.canvas.add(this.img);
		});
		if (this.healthbarCurr)
			this.canvas.remove(this.healthbarCurr);
		if (this.healthbarMis)
			this.canvas.remove(this.healthbarMis);
		this.healthbarCurr = new fabric.Rect({
			left: !this.right ? 50 : 370,
			top: 350,
			fill: 'green',
			height: 10,
			width: 100
		});
		this.healthbarMis = new fabric.Rect({
			left: !this.right ? 50 : 370,
			top: 350,
			fill: 'red',
			height: 10,
			width: 100
		});
		this.canvas.add(this.healthbarMis);
		this.canvas.add(this.healthbarCurr);
	}

	public attacks() {
		this.img.animate('left', this.right ? '+=20' : '-=20', {
			duration: 250,
			onChange: this.canvas.renderAll.bind(this.canvas),
			easing: fabric.util.ease['easeOutQuad'],
			onComplete: () => {
				this.img.animate('left', this.right ? '-=120' : '+=120', {
					duration: 100,
					easing: fabric.util.ease['easeInQuint'],
					onChange: this.canvas.renderAll.bind(this.canvas),
					onComplete: () => {
						this.img.animate('left', this.right ? 420 : 150, {
							duration: 200,
							onChange: this.canvas.renderAll.bind(this.canvas),
							easing: fabric.util.ease['easeOutQuint'],
						})
					}
				});
			}
		});
	}

	public dies() {
		this.img.animate('angle', this.right ? '-90' : '90', {
			duration: 700,
			onChange: this.canvas.renderAll.bind(this.canvas),
			onComplete: () => {
				this.img.animate('opacity', 0, {
					duration: 200,
					onChange: this.canvas.renderAll.bind(this.canvas),
					onComplete: () => {
						this.canvas.remove(this.img);
						this.canvas.remove(this.healthbarCurr);
						this.canvas.remove(this.healthbarMis);
					}
				});
			}
		});
	}

	public damage() {
		let dmg = new fabric.Text('20', {
			fontSize: 30,
			fill: 'red',
			top: 100,
			left: !this.right ? 100 : 420
		});

		this.canvas.add(dmg);
		dmg.animate('top', '-=50', {
			duration: 500,
			onChange: this.canvas.renderAll.bind(this.canvas),
			onComplete: () => {
				this.canvas.remove(dmg);
			}
		});

	}

	public healthbar() {
		if(!this.healthbarCurr.width)
			return;
		if(this.healthbarCurr.width <= 0)
			this.healthbarCurr.width = 0;
		this.healthbarCurr.animate('width', '-=10', {
			duration: 200,
			onChange: this.canvas.renderAll.bind(this.canvas),
		});
	}
}

export class GameState {
	public canvas:	fabric.Canvas;
	public message: any;
	public player1: Combatant;
	public player2: Combatant;

	//public players: Combatant[] = []; Eventually do this


	constructor() {
		this.canvas = new fabric.Canvas('arena'); // USE StaticCanvas for noninteractive

	}

	public initPlayers() {
		this.player1 = new Combatant(this.message.characters[0], 0, this.canvas);
		this.player2 = new Combatant(this.message.characters[1], 1, this.canvas);
		this.drawPlayers();
	}

	public drawPlayers() {
		this.player1.draw();
		if (this.player2)
			this.player2.draw();
	}
}
