import { Event as GraphicsEvent } from './graphicsEvents';
import { Character } from './characterPicker';
import { Stats } from './Status';

// what gets sent to the front end

export interface Message { // needs name change
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
    characters: {
        stats: Stats;
        className: string;
        art: number;
        level: number;
    }[]
}

export interface CharacterChoice {
    choice: number;
}

export interface FrontEndSettings {
    position: {
        x: number;
        y: number;
    };
    size: number;
}

export interface BackToFrontMessage {
    newReel?: Message;
    characterChoices?: CharacterChoices;
    id?: number;
}

export interface FrontToBackMessage {
    characterChoice: CharacterChoice;
}
