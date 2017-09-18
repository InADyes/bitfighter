import * as Reel from '../shared/displayReel';
import { Message } from '../shared/frontEndMessage';
import 'fabric'
declare let fabric: any;

export class Display {
    public newReel(message: Message) {
        console.log('new reel:', message);
    }
}

export class gameState {
	public canvas:	fabric.Canvas;
	public img1:	HTMLImageElement;
	public img2:	HTMLImageElement;
	public p1:		fabric.Image;
	public p2:		fabric.Image;
	public healthbar: fabric.Rect;
	
	constructor() {
		this.canvas = new fabric.Canvas('arena'); // USE StaticCanvas for noninteractive
		this.img1 = new Image();
		this.img2 = new Image();
	}
}
