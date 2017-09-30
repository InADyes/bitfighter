import { Event as GraphicsEvent } from './graphicsEvents';
import { Character } from './characterPicker';
import { Stats } from './Status';
import { choiceStats } from '../back_end/characterChoiceHandler';

// what gets sent to the front end

export interface Message { // needs name change
    characters: {
        name: string;
        currentHitPoints: number;
        maxHitPoints: number;
        art: number;
        profileImageURL: string;
        chatMessage: string;
    }[];
    reel: GraphicsEvent[];
    patch?: number; // if this is defined then the reel is a patch at the specified time
}

export interface CharacterCard {
    stats: choiceStats;
    baseHealth: number;
    bonusHealth: number;
    className: string;
    art: number;
    level: number;
    rarity: number;
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
    cardsTimeout: number;
    assetsShim: string;
}

export interface BackToFrontMessage {
    newReel?: Message;
    characterChoices?: CharacterCard[];
    id?: number;
}

export interface FrontToBackMessage {
    characterChoice: CharacterChoice;
}

export interface StatBarAmount {
    amount: number;
    factor: number;
}