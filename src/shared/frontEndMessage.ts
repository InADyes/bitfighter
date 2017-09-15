import * as displayReel from './displayReel';
import { Status } from './statusTypes';

// what gets sent to the front end

export interface Message {
    characters: {
        name: string;
        hitPoints: number;
    }[];
    reel:  displayReel.Event[];
}