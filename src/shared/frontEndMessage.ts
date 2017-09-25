import { Event as GraphicsEvent } from './graphicsEvents';
import { Character } from './characterPicker';

// what gets sent to the front end

export interface Message {
    characters: {
        name: string;
        currentHitPoints: number;
        maxHitPoints: number;
        art: number;
    }[];
    reel: GraphicsEvent[];
    patch?: number; // if this is defined then the reel is a patch at the specified time
}

export interface CharacterChoices {
    characters: Character[]
}

export interface CharacterChoice {
    choice: number
}
