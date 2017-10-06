import * as Events from '../../shared/graphicsEvents';
import { ReelMessage } from '../../shared/interfaces/backToFrontMessage';
import 'fabric'
declare let fabric: any;
import * as Player from './Player';
import { fireEvent } from './fireEvent';

declare function recalcHp(damageAmount: number, newHp: number, maxHp: number, attacker: string): void;
declare function flip(side: 'front' | 'back'): void;
declare function updateBitBoss(bossData: {
	name: string,
	hp: number,
	maxHp: number,
	img: string,
	character: string,
	bossMessage: string,
	bossEmoticonURL: string
}): void;

export class GameState {
	private eventLoopTimeout:	number | null;
	private lastTime: 			number;
	private canvas:				fabric.Canvas; 
	private reel:				Events.Event[];
	private player1:			Player.Player | null;
	private player2:			Player.Player | null;
	private idleId:				number;
	private currentBoss:		{
		name: string,
		hp: number,
		maxHp: number,
		img: string,
		character: string,
		bossMessage: string,
		bossEmoticonURL: string
	};
	private ogTime:				number;
	private timer:				number;
	private countBot:			fabric.Text;
	private countTop:			fabric.Text;
	private scale =				1;
	private scaleWait =			0;
	private isWaiting =			0;
	private baseWidth = 		500;
	private baseHeight = 		180;
	private messageQueue = 		[];

	constructor(
		canvasId: string,
		private readonly charArt: string[],
		private readonly buffArt: string[]
	) {
		this.canvas = new fabric.StaticCanvas(canvasId);
		this.canvas.setWidth(this.baseWidth);
		this.canvas.setWidth(this.baseHeight);
		this.player1 = null;
		this.player2 = null;
	}

	public newMessage(msg: ReelMessage) {
		// Don't do anything yet if a character is dying or moving over
		if ((this.player1 && this.player1.isAnimated())
			|| (this.player2 && this.player2.isAnimated())) {
			window.setTimeout(() => {this.newMessage(msg)}, 10);
			return;
		}
		// if there's a patch in the middle of a reel
		if (msg.patch && this.reel[0]) {
			clearTimeout(this.idleId);
			this.applyPatch(msg.reel, msg.patch);
		}
		else  {
			this.clearReel();
			this.reel = msg.reel;

			// if there's a patch immediately fire next event, otherwise start new reel
			if (msg.patch)
				this.getNextEvent();
			else {
				clearTimeout(this.idleId);
				this.canvas.clear();
				// init players
				this.player1 = new Player.Player(msg.characters[0], 0, this.canvas, this.scale, this.charArt, this.buffArt);
				this.currentBoss = this.player1.getBitBossInfo();
				console.log(this.currentBoss);
				updateBitBoss({boss: this.currentBoss});
				recalcHp(0, this.currentBoss.hp, this.currentBoss.maxHp, "hello world");
				if (msg.characters[1]) {
					this.player2 = new Player.Player(msg.characters[1], 1, this.canvas, this.scale, this.charArt, this.buffArt);
					flip('back');
					console.log("flip back");
					this.ogTime = performance.now();
				}
				else
					this.idleCheck();
				this.drawPlayers();
				this.initReel();
			}
		}
	}

	private clearReel() {
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
				this.getNextEvent();
			},
			this.reel[0].time - (performance.now() - this.ogTime)
		);
	}

	private getNextEvent() {
		let event = this.reel.shift();
		if (event == undefined) {
			this.eventLoopTimeout = null;
			this.idleCheck();
			return;
		}
		let nextTime = this.reel[0] ? this.reel[0].time : 0;
		fireEvent(event, this);
		let delay = nextTime - (performance.now() - this.ogTime);
		if (delay < 0)
			delay = 0;
		//console.log(nextTime, performance.now(), this.ogTime, delay);
		this.eventLoopTimeout = window.setTimeout(
			() => {
				this.getNextEvent();
			},
			delay //used to be nextTime - event.time
		);
		//this.lastTime = event.time;
	}

	private applyPatch(reel: Events.Event[], patch: number) {
		for (let i = 0; i < this.reel.length; i++) {
			if (reel[0].time < this.reel[i].time) {
				this.reel.splice(i);
				this.reel.push(...reel);
				break;
			}
		}
	}

	public drawPlayers() {
		if (this.player1)
			this.player1.drawMe();
		if (this.player2)
			this.player2.drawMe();
	}

	public attack(p2: number) {
		if (p2 && this.player2)
			this.player2.attacks();
		else if (!p2 && this.player1)
			this.player1.attacks();
	}
	
	public changeHealth(p2: number, newHp: number) {
		if (p2 && this.player2)
			this.player2.adjustHp(newHp);
		else if (this.player1) {
			let p = this.player1.getBitBossInfo();
			recalcHp(p.hp - newHp, newHp, p.maxHp, "hello world");
			this.player1.adjustHp(newHp);
		}
	}

	public slay(p2: number) {
		if (this.player2 && p2) {
			this.player2.dies(null);
			if (this.player1)
				this.player1.clearBuffs();
			this.player2.clearBuffs();
			this.player2 = null;
		}
		else if (this.player1) {
			this.player1.dies(this.player2);
			this.player1.clearBuffs();
			if (this.player2) {
				this.currentBoss = this.player2.getBitBossInfo();
				updateBitBoss({boss: this.currentBoss});
				this.player2.clearBuffs();
			}
			this.newChampion();
		}

		// Start checking if a fight idles too long to switch to bitboss
		this.idleCheck();
	}

	public newChampion() {
		if ((this.player1 && this.player1.isAnimated()) || (this.player2 && this.player2.isAnimated())) {
			window.setTimeout(() => {this.newChampion()}, 1);
			return;
		}
		this.player1 = this.player2;
		this.player2 = null;
	}

	public displayText(p2: number, str: string, color: string) {
	if (p2 && this.player2)
			this.player2.displayText(str, color);
		else if (this.player1)
			this.player1.displayText(str, color);
	}

	public setNewScale(scale: number) {
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

	public addBuff(art: number, duration: number, p2: number) {
		if (p2 && this.player2)
			this.player2.addBuff(art, duration);
		else if (this.player1)
			this.player1.addBuff(art, duration);
	}

	private idleCheck() {
		// If bitfighter mode idles for full amount, switch to bitboss mode
		this.idleId = window.setTimeout(
			() => {
				console.log("flip to front");
				flip('front')
			}, 4000
		);
	}

	public startTimer(time: number) {
		this.timer = time / 1000;
		this.countdown();
	}

	private countdown() {
		if (!this.timer) {
			if (this.countBot)
				this.canvas.remove(this.countBot);
			if (this.countTop)
				this.canvas.remove(this.countTop);
			return;
		}
		
		if (this.countBot)
			this.canvas.remove(this.countBot);
		if (this.countTop)
			this.canvas.remove(this.countTop);
		this.countBot = new fabric.Text(`NEXT FIGHT IN: ${ this.timer }`, {
			fontSize: 17 * this.scale,
			fontFamily: 'concert one',
			fontWeight: 'bold',
			fill: 'white',
			stroke: 'white',
			strokeWidth: 2 * this.scale,
			left: 9 * this.scale,
			top: 9 * this.scale,
			originX: 'left'
		})
		this.countTop = new fabric.Text(`NEXT FIGHT IN: ${ this.timer }`, {
			fontSize: 17 * this.scale,
			fontFamily: 'concert one',
			fontWeight: 'bold',
			fill: 'black',
			left: 10 * this.scale,
			top: 9 * this.scale,
			originX: 'left'
		})
		this.canvas.add(this.countBot);
		this.canvas.add(this.countTop);
		this.timer--;
		
		window.setTimeout(() => {
			this.countdown();
		}, 1000);
	}

	public updateBossMessage(p2: number, str: string) {
		if (p2 && this.player2)
			this.player2.updateBossMessage(str);
		else if (!p2 && this.player1)
			this.player1.updateBossMessage(str);
	}

	public updateEmote(p2: number, str: string) {
		if (p2 && this.player2)
			this.player2.updateEmote(str);
		else if (!p2 && this.player1)
			this.player1.updateEmote(str);
	}
}