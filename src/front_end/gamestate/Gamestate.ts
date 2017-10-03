import * as Events from '../../shared/graphicsEvents';
import { Message } from '../../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;
import * as Player from './Player';
import { fireEvent } from './fireEvent';

declare function recalcHp(damageAmount: number, newHp: number, maxHp: number): void;
declare function flip(side: 'front' | 'back'): void;
declare function updateBitBoss(bossData: Object): void;

export class GameState {
	private eventLoopTimeout:	number | null;
	private lastTime: 			number;
	private canvas:				fabric.Canvas; 
	private reel:				Events.Event[];
	private player1:			Player.Player | null;
	private player2:			Player.Player | null;
	private idleId:				number;
	private currentBoss:		Object;
	private ogTime:				number;
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
		this.canvas = new fabric.StaticCanvas(canvasId); // USE StaticCanvas for noninteractive
		this.canvas.setWidth(this.baseWidth);
		this.canvas.setWidth(this.baseHeight);
		this.player1 = null;
		this.player2 = null;
	}

	// public newMessage(
	// 	reel: Events.Event[],
	// 	characters: {
	// 		name: string,
	// 		currentHitPoints: number,
	// 		maxHitPoints: number,
	// 		art: number,
	// 		profileImageURL: string,
	// 		chatMessage: string
	// 	}[],
	// 	patch?: number
	// ) {
		public newMessage(msg: Message) {
		// Add received message to the queue
		// Don't do anything if a character is dying or moving over
		if ((this.player1 && this.player1.isAnimated())
			|| (this.player2 && this.player2.isAnimated())) {
			window.setTimeout(() => {this.newMessage(msg)}, 1);
			return;
		}
		console.log(msg.reel);
		// if there's a patch in the middle of a reel
		clearTimeout(this.idleId);
		if (msg.patch && this.reel[0]) {
			this.applyPatch(msg.reel, msg.patch);
		}
		else  {
			this.clearMessage();
			this.reel = msg.reel;

			// if there's a patch immediately fire next event, otherwise start new reel
			if (msg.patch)
				this.getEvent();
			else {
				this.canvas.clear();
				// init players
				this.player1 = new Player.Player(msg.characters[0], 0, this.canvas, this.scale, this.charArt, this.buffArt);
				this.currentBoss = this.player1.getBitBossInfo();
				updateBitBoss({boss: this.currentBoss});
				if (msg.characters[1]) {
					this.player2 = new Player.Player(msg.characters[1], 1, this.canvas, this.scale, this.charArt, this.buffArt);
					flip('back');
					this.ogTime = performance.now();
				}
				else
					this.idleCheck();
				this.drawPlayers();
				this.initReel();
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
			this.reel[0].time - (performance.now() - this.ogTime)
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
		let delay = nextTime - (performance.now() - this.ogTime);
		if (delay < 0)
			delay = 0;
		this.eventLoopTimeout = window.setTimeout(
			() => {
				this.getEvent();
			},
			delay //used to be nextTime - event.time
		);
		//this.lastTime = event.time;
	}

	private applyPatch(reel: Events.Event[], patch: number) {
		//while (reel[0].time != patch)
		//	reel.shift();
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
			this.player1.draw();
		if (this.player2)
			this.player2.draw();
	}

	public attack(p2: number) {
		if (p2 && this.player2)
			this.player2.attacks();
		else if (!p2 && this.player1)
			this.player1.attacks();
	}
	
	public changeHealth(p2: number, amount: number) {
		if (p2 && this.player2)
			this.player2.healthbar(amount);
		else if (this.player1) {
			this.player1.healthbar(amount);
			let p = this.player1.getBitBossInfo();
			recalcHp(amount, p.hp, p.maxHp);
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
				updateBitBoss({boss: this.player1.getBitBossInfo(), attacker: this.player2.getBitBossInfo()});
				this.currentBoss = this.player2.getBitBossInfo();
				this.player2.clearBuffs();
			}
			this.newChampion();
		}

		// Start checking if a fight idles too long to switch to bitboss
		this.idleCheck();
	}
	newChampion() {
		if ((this.player1 && this.player1.isAnimated()) || (this.player2 && this.player2.isAnimated())) {
			window.setTimeout(() => {this.newChampion()}, 1);
			return;
		}
		this.player1 = this.player2;
		this.player2 = null;
	}
	public displayText(p2: number, str: string, color: string) {
	if (p2 && this.player2)
			this.player2.text(str, color);
		else if (this.player1)
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

	public addBuff(art: number, duration: number, p2: number) {
		if (p2 && this.player2)
			this.player2.addBuff(art, duration);
		else if (this.player1)
			this.player1.addBuff(art, duration);
	}

	private idleCheck() {
		this.idleId = window.setTimeout(() => {this.switchToBitBoss()}, 10000);
	}

	private switchToBitBoss() {
		console.log("SWITCH TO BIT BOSS");
		flip('front');
	}
}
