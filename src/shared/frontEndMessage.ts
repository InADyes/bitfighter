import * as displayReel from './displayReel';

// what gets sent to the front end

export interface Message {
    characters: {
        name: string;
        hitPoints: number;
    }[];
    reel:  displayReel.Event[];
    patch?: number; // if this is defined then the reel is a patch at the specified time
}