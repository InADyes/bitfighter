import * as Events from '../shared/graphicsEvents';
import { Message } from '../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;
import * as Player from './Player';
import { fireEvent } from './fireEvent';

export class GameState {
	private eventLoopTimeout: NodeJS.Timer | null;
	private lastTime: number;

	private canvas = new fabric.Canvas('arena'); // USE StaticCanvas for noninteractive
	private center = this.canvas.getWidth() / 2;
	private reel:		Events.Event[];
	private player1:	Player.Player;
	private player2:	Player.Player;
	//public players: Player[] = []; Eventually do this

	constructor() {}

	public newMessage(reel: Events.Event[], patch?: number) {
		if (patch) {
			//do the patching
		}
		else {
			this.clearMessage();
			this.reel = reel;
			this.initReel();
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

		this.lastTime = 0;
		this.eventLoopTimeout = setTimeout(
			() => {
				this.getEvent();
			},
			this.reel[0].time
		);
	}

	private getEvent() {
		let event = this.reel.shift();
		let nextTime = this.reel[0] ? this.reel[0].time : 0;
		if (event == undefined) {
			this.eventLoopTimeout = null;
			return;
		}

		fireEvent(event, this);
		(event);

		this.eventLoopTimeout = setTimeout(
			() => {
				this.getEvent();
			},
			nextTime - event.time
		);
		this.lastTime = event.time;
	}

	public initPlayers(characters: {name: string, currentHitPoints: number, maxHitPoints: number, art: number}[]) {
		this.player1 = new Player.Player(characters[0], 0, this.canvas);
		if (characters[1])
			this.player2 = new Player.Player(characters[1], 1, this.canvas);
		this.drawPlayers();
	}

	public drawPlayers() {
		this.player1.draw(this.center);
		if (this.player2)
			this.player2.draw(this.center);
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
			this.player2.dies();
		else
			this.player1.dies();
	}

	public displayText(p2: number, str: string, color: string) {
		if (p2)
			this.player2.text(str, color);
		else
			this.player1.text(str, color);
	}
}
