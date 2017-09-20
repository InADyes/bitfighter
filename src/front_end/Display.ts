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
	private reel:	Events.Event[];
	private player1: Player.Player;
	private player2: Player.Player;
	//public players: Player[] = []; Eventually do this

	constructor() {}

	public newMessage(reel: Events.Event[], patch?: number) {
		if (patch) {
			//do the patching
		}
		else {
			//clear message
			this.clearMessage();
			// new reel
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

	// private displayReel() {
	// 	let current = this.reel.shift();
	// 	if (current === undefined)
	// 		return; 
	// 	this.fireEvent(current);
	// }

	private getEvent() {
		let event = this.reel.shift();
		if (event == undefined) {
			this.eventLoopTimeout = null;
			return;
		}

		console.log(`do this event`, event);
			fireEvent(event, this);
		(event);

		this.eventLoopTimeout = setTimeout(
			() => {
				this.getEvent();
			},
			event.time -  this.lastTime
		);
		this.lastTime = event.time;
	}

	public initPlayers(characters: {name: string, hitPoints: number, art: number}[]) {
		this.player1 = new Player.Player(characters[0], 0, this.canvas);
		this.player2 = new Player.Player(characters[1], 1, this.canvas);
		this.drawPlayers();
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
}
