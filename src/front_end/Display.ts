import * as Reel from '../shared/displayReel';

export class Display {
    public newReel(reel: Reel.Event[]) {
        console.log('new reel:', reel);
    }
}
