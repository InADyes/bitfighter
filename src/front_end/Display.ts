import * as Events from '../shared/graphicsEvents';
import { Message } from '../shared/frontEndMessage';

export class Display {
    public newEvents(message: Message) {
        console.log('new reel:', message);
    }
}
