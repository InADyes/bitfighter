import * as Reel from '../shared/displayReel';
import { Message } from '../shared/frontEndMessage';

export class Display {
    public newReel(message: Message) {
        console.log('new reel:', message);
    }
}
