import * as graphicsEvents from './graphicsEvents';

// what gets sent to the front end

export interface Message {
    characters: {
        name: string;
        currentHitPoints: number;
        maxHitPoints: number;
        art: number;
    }[];
    reel:  graphicsEvents.Event[];
    patch?: number; // if this is defined then the reel is a patch at the specified time
}
