import { GraphicsEvent } from '../../shared/interfaces/graphicsEvents';
import { ReelMessage, FrontendCharacter } from '../../shared/interfaces/backToFrontMessage';
import 'fabric'
declare let fabric: any;
import * as Player from './Player';
import { fireEvent } from './fireEvent';
import { BossData } from './interfaces';
import { recalcHp, flip, updateBitBoss } from '../globalDependencies'

// declare function recalcHp(damageAmount: number, newHp: number, maxHp: number, attacker: string | null): void;
// declare function flip(side: 'front' | 'back'): void;
// declare function updateBitBoss(bossData: {boss: BossData, attacker?: BossData}): void;
export class GameState {
	private eventLoopTimeout:	number | null;
	private lastTime: 			number;
	private canvas:				fabric.Canvas; 
	private reel:				GraphicsEvent[];
	private player1:			Player.Player | null;
	private player2:			Player.Player | null;
	private idleId:				number | null;
	private currentBoss:		BossData;
	private ogTime:				number;
	private timer:				number;
	private countBot:			fabric.Text;
	private countTop:			fabric.Text;
	private characterCards:		FrontendCharacter[];
	private align:				'left' | 'right' | 'center'; 
	private scale =				1;
	private scaleWait =			0;
	private isWaiting =			0;
	private baseWidth = 		500;
	private baseHeight = 		250;
	private messageQueue = 		[];

	constructor(
		canvasId: string,
		private readonly charArt:				string[],
		private readonly buffArt:				string[],
		private readonly atkArt:				string[],
		private readonly characterStateChange:	(characters: FrontendCharacter[]) => void,
		private readonly bfDiv:					HTMLDivElement
	) {
		this.canvas = new fabric.StaticCanvas(canvasId);
		this.canvas.setWidth(this.baseWidth);
		this.canvas.setWidth(this.baseHeight);
		this.player1 = null;
		this.player2 = null;
		this.align = 'left';
	}

	public newMessage(msg: ReelMessage, hasTimer: number) {
		// Don't do anything yet if a character is dying or moving over
		if ((this.player1 && this.player1.isAnimated())
			|| (this.player2 && this.player2.isAnimated())) {
			window.setTimeout(() => {this.newMessage(msg, hasTimer)}, 10);
			return;
		}
		// Update hover cards
		this.characterCards = msg.characters;
		this.characterStateChange(msg.characters);

		// if there's a patch in the middle of a reel
		if (msg.patch && this.reel[0]) {
			if (this.idleId) {
				clearTimeout(this.idleId);
				this.idleId = null;
			}
			this.idleId = null;
			this.applyPatch(msg.reel, msg.patch);
		}
		else {
			this.clearReel();
			this.reel = msg.reel;

			// if there's a patch immediately fire next event, otherwise start new reel
			if (msg.patch)
				this.getNextEvent();
			else {
				if (this.idleId){
					clearTimeout(this.idleId);
					this.idleId = null;
				}
				this.canvas.clear();
				// init players
				if (msg.characters[0]) {
					this.player1 = new Player.Player(
						msg.characters[0],
						0, // player 2 false
						this.canvas,
						this.scale,
						this.charArt,
						this.buffArt,
						this.atkArt,
						this.align,
						this.bfDiv
					);
					this.currentBoss = this.player1.getBitBossInfo();
					updateBitBoss({boss: this.currentBoss});
					console.log(`TIM SAYS: UPDATE BITBOSS`, this.currentBoss);
					recalcHp(0, this.currentBoss.hp, this.currentBoss.maxHp, null);
					if (msg.characters[1]) {
						this.player2 = new Player.Player(
							msg.characters[1],
							1, // player 2 true
							this.canvas,
							this.scale,
							this.charArt,
							this.buffArt,
							this.atkArt,
							this.align,
							this.bfDiv
						);
						if (hasTimer) {
							window.setTimeout(()=>{
								flip('back');
								console.log("flip back");
							}, 4000)
						}
						else {
							flip('back');
							console.log("flip back");
						}
						this.ogTime = performance.now();
					}
					else if (!msg.characters[1] && this.player2)
						this.player2 = null;
					this.drawPlayers();
				}
				else
					this.idleCheck();
				window.setTimeout(()=>this.initReel(), 500);
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
		const event = this.reel.shift();
		if (event === undefined) {
			this.eventLoopTimeout = null;
			this.idleCheck();
			return;
		}
		const nextTime = this.reel[0] ? this.reel[0].time : 0;
		fireEvent(event, this);
		let delay = nextTime - (performance.now() - this.ogTime);
		if (delay < 0)
			delay = 0;
		//console.log(nextTime, performance.now(), this.ogTime, delay);
		this.eventLoopTimeout = window.setTimeout(
			() => this.getNextEvent(),
			delay //used to be nextTime - event.time
		);
	}

	private applyPatch(reel: GraphicsEvent[], patch: number) {
		for (let i = 0; i < this.reel.length; i++) {
			if (reel[0].time < this.reel[i].time) {
				this.reel.splice(i);
				this.reel.push(...reel);
				break;
			}
		}
	}

	public drawPlayers() {
		if (this.player1 && this.align === "left")
			this.player1.drawMe(this.player2 ? this.player2 : null, 0);
		else if (this.player2 && this.align === "right")
			this.player2.drawMe(this.player1 ? this.player1 : null, 0);
		else if (!this.player2 && this.align === "right" && this.player1)
			this.player1.drawMe(null, 100 * this.scale);
		else if (this.align === "center" && this.player1) {
			this.player1.drawMe(null, 0);
			if (this.player2)
				this.player2.drawMe(null, 0);
		}
	}

	public attack(p2: number) {
		if (p2 && this.player2)
			this.player2.attacks();
		else if (!p2 && this.player1)
			this.player1.attacks();
	}
	
	public changeHealth(p2: number, newHp: number, attacker: string | null) {
		if (p2 && this.player2)
			this.player2.adjustHp(newHp);
		else if (this.player1) {
			let p = this.player1.getBitBossInfo();
			recalcHp(p.hp - newHp, newHp, p.maxHp, attacker);
			this.player1.adjustHp(newHp);
		}
	}

	public slay(p2: number) {
		if (this.player2 && p2) {
			this.player2.dies(null);
			if (this.player1) {
				this.player1.clearBuffs();
			}
			this.player2.clearBuffs();
			this.player2 = null;
			this.characterCards.splice(1, 1);
			this.characterStateChange(this.characterCards);
			
		}
		else if (this.player1) {
			this.player1.dies(this.player2);
			this.player1.clearBuffs();
			if (this.player2) {
				this.currentBoss = this.player2.getBitBossInfo();
				console.log(`TIM SAYS: UPDATE BITBOSS`, this.currentBoss);
				updateBitBoss({boss: this.currentBoss});
				this.player2.clearBuffs();
			}
			this.newChampion();
			this.characterCards.splice(0, 1);
			this.characterStateChange(this.characterCards);
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

	public displayText(p2: number, str: string, color: string, duration: number) {
		if (p2 && this.player2)
			this.player2.displayText(str, color, duration);
		else if (this.player1)
			this.player1.displayText(str, color, duration);
	}

	public setNewScale(scale: number) {
		console.log(`TIM: My new scale: ${scale}`);
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
		this.drawPlayers();
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
			top: 10 * this.scale,
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
		else if (!p2 && this.player1) {
			this.player1.updateBossMessage(str);
			this.currentBoss = this.player1.getBitBossInfo();
			updateBitBoss({ boss: this.currentBoss });
			console.log(`TIM SAYS: UPDATE BITBOSS`, this.currentBoss);
		}
	}

	public updateEmote(p2: number, str: string) {
		if (p2 && this.player2)
			this.player2.updateEmote(str);
		else if (!p2 && this.player1) {
			this.player1.updateEmote(str);
			this.currentBoss = this.player1.getBitBossInfo();
			updateBitBoss({ boss: this.currentBoss });
			console.log(`TIM SAYS: UPDATE BITBOSS`, this.currentBoss);
		}
	}

	public setAlign(alignment: 'left' | 'right' | 'center') {
		/* 
		 * Defaults to Left alignment.
		 * Center alignment draws the images from the center of the canvas out.
		 * So something wide like the dragon will appear further to the side
		 * than someone small.
		 * Player 1 is always drawn on the left, so in Right alignment its position
		 * is relative to the width of his opponent. When there is no opponent it
		 * defaults to a size. In the case of player 1 dying, player 2 moves over
		 * base on his own width then readjusts to his opponent's width if there's
		 * a fight in queue.
		 */
		this.align = alignment;
		if (this.player1)
			this.player1.setAlignment(this.align);
		if (this.player2)
			this.player2.setAlignment(this.align);
		this.drawPlayers();
	}
}