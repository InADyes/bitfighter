import * as Reel from '../shared/DisplayReel';

export class Display {
    public newReel(reel: Reel.Event[]) {
        console.log('new reel:', reel);
    }
}
