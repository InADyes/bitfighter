import * as displayReel from './displayReel';

// what gets sent to the front end

export interface Message {
    characters: {
        name: string;
        hitPoints: number;
        art: number;
    }[];
    reel:  displayReel.Event[];
}