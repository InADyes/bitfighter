import * as Reel from '../shared/displayReel';
import { Message } from '../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;
import * as Player from './Player';

export class GameState {
	public canvas:	fabric.Canvas;
	public message: any;
	public player1: Player.Player;
	public player2: Player.Player;

	//public players: Player[] = []; Eventually do this


	constructor() {
		this.canvas = new fabric.Canvas('arena'); // USE StaticCanvas for noninteractive

	}

	public initPlayers() {
		this.player1 = new Player.Player(this.message.characters[0], 0, this.canvas);
		this.player2 = new Player.Player(this.message.characters[1], 1, this.canvas);
		this.drawPlayers();
	}

	public drawPlayers() {
		this.player1.draw();
		if (this.player2)
			this.player2.draw();
	}
}
