import * as Events from '../../shared/graphicsEvents';
import { Message } from '../../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;
import * as Player from './Player';
import { fireEvent } from './fireEvent';

declare function recalcHp(damageAmount: number, newHp: number, maxHp: number): void;
declare function flip(side: 'front' | 'back'): void;

export class GameState {
	private eventLoopTimeout:	number | null;
	private lastTime: 			number;
	private canvas:				fabric.Canvas; 
	private reel:				Events.Event[];
	private player1:			Player.Player;
	private player2:			Player.Player;
	private idleId:				number;
	private scale =				1;
	private scaleWait =			0;
	private isWaiting =			0;
	private baseWidth = 		500;
	private baseHeight = 		180;

	constructor(canvasId: string) {
		this.canvas = new fabric.StaticCanvas(canvasId); // USE StaticCanvas for noninteractive
		this.canvas.setWidth(this.baseWidth);
		this.canvas.setWidth(this.baseHeight);
	}

	public newMessage(reel: Events.Event[], characters: {name: string, currentHitPoints: number, maxHitPoints: number, art: number}[], patch?: number) {
		// if there's a patch in the middle of a reel
		clearTimeout(this.idleId);
		if (patch && this.reel[0]) {
			this.applyPatch(reel);
		}
		else {
			this.clearMessage();
			this.reel = reel;

			// if there's a patch immediately fire next event, otherwise start new reel
			if (patch)
				this.getEvent();
			else {
				this.canvas.clear();
				this.initReel();
				// init players
				this.player1 = new Player.Player(characters[0], 0, this.canvas, this.scale);
				if (!characters[1])
					this.idleCheck();
				if (characters[1])
					this.player2 = new Player.Player(characters[1], 1, this.canvas, this.scale);
				this.drawPlayers();
			}
		}
	}

	private clearMessage() {
		this.reel = [];
		if (this.eventLoopTimeout)
			clearTimeout(this.eventLoopTimeout);
	}

	private initReel() {
		if (this.reel.length < 1) {
			return;
		}
		this.eventLoopTimeout = window.setTimeout(
			() => {
				this.getEvent();
			},
			this.reel[0].time
		);
	}

	private getEvent() {
		let event = this.reel.shift();
		if (event == undefined) {
			this.eventLoopTimeout = null;
			return;
		}
		let nextTime = this.reel[0] ? this.reel[0].time : 0;

		fireEvent(event, this);
		(event);
		this.eventLoopTimeout = window.setTimeout(
			() => {
				this.getEvent();
			},
			nextTime - event.time
		);
		this.lastTime = event.time;
	}

	private applyPatch(reel: Events.Event[]) {
		for (let i = 0; i < this.reel.length; i++) {
			if (reel[0].time < this.reel[i].time) {
				this.reel.splice(i);
				this.reel.push(...reel);
				break;
			}
		}
	}

	public drawPlayers() {
		this.player1.draw();
		if (this.player2)
			this.player2.draw();
	}

	public attack(p2: number) {
		if (p2)
			this.player2.attacks();
		else
			this.player1.attacks();
	}
	
	public changeHealth(p2: number, amount: number) {
		if (p2)
			this.player2.healthbar(amount);
		else
			this.player1.healthbar(amount);
	}

	public slay(p2: number) {
		if (p2)
			this.player2.dies(null);
		else{
			this.player1.dies(this.player2)
		}
		this.player1.clearBuffs();
		this.player2.clearBuffs();

		// Start checking if a fight idles too long to switch to bitboss
		this.idleCheck();
	}

	public displayText(p2: number, str: string, color: string) {
		if (p2)
			this.player2.text(str, color);
		else
			this.player1.text(str, color);
	}

	public setNewScale(scale: number) {
		/*if (this.scaleWait && scale != null) {
			this.scaleWait = scale;
			return;
		}
		
		if ((this.player1 || this.player2) && (this.player1.isAnimated() || this.player2.isAnimated())) {
			setTimeout(() => {this.setNewScale(null)}, 1);
		}
		else {*/
		this.scaleWait = scale;
		let oldScale = this.scale;
		this.scale = this.scaleWait;
		this.canvas.setWidth(this.scaleWait * this.baseWidth);
		this.canvas.setHeight(this.scaleWait * this.baseHeight);
		this.canvas.clear();
		if (this.player1)
			this.player1.setScale(this.scaleWait);
		if (this.player2)
			this.player2.setScale(this.scaleWait);
		this.scaleWait = 0;
	}

	public addBuff(art: number, duration: number, player2: number) {
		if (player2)
			this.player2.addBuff(art, duration);
		else
			this.player1.addBuff(art, duration);
	}

	private idleCheck() {
		this.idleId = window.setTimeout(() => {this.switchToBitBoss()}, 30000);
	}

	private switchToBitBoss() {
		console.log("SWITCH TO BIT BOSS");
		//recalcHp(damageAmount: number, newHp: number, maxHp: number);
		//flip('front');
	}
}
