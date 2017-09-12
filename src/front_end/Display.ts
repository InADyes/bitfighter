import * as Reel from '../Reel';

export class Display {
    public newReel(reel: Reel.Event[]) {
        console.log('new reel:', reel);
    }
}
