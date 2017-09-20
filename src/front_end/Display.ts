import * as Events from '../shared/graphicsEvents';
import { Message } from '../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;
import * as Player from './Player';

export class GameState {
	public canvas:	fabric.Canvas;
	public reel:	Events.Event[];
	public player1: Player.Player;
	public player2: Player.Player;
	//public players: Player[] = []; Eventually do this


	constructor() {
		this.canvas = new fabric.Canvas('arena'); // USE StaticCanvas for noninteractive
	}

	public displayReel() {

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
