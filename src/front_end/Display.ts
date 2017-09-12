import * as Reel from '../DisplayReel';

export class Display {
    public newReel(reel: Reel.Event[]) {
        console.log('new reel:', reel);
    }
}
