import * as Events from '../shared/graphicsEvents';
import { Message } from '../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;
import * as Player from './Player';

export class GameState {
	private eventLoopTimeout: NodeJS.Timer | null;
	private lastTime: number;

	private canvas:	fabric.Canvas;
	private reel:	Events.Event[];
	private player1: Player.Player;
	private player2: Player.Player;
	//public players: Player[] = []; Eventually do this


	constructor() {
		this.canvas = new fabric.Canvas('arena'); // USE StaticCanvas for noninteractive
	}

	private initReel() {
		if (this.reel.length < 1) {
			return;
		}

		this.lastTime = 0;
		this.eventLoopTimeout = setTimeout(
			() => {
				this.fireEvent();
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

	private fireEvent() {
		let event = this.reel.shift();
		if (event == undefined) {
			this.eventLoopTimeout = null;
			return;
		}

		console.log(`do this event ${ event }`);

		this.eventLoopTimeout = setTimeout(
			() => {
				this.fireEvent();
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
}
