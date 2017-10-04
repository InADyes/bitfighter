import { Event as GraphicsEvent } from './graphicsEvents';
import { Character } from './characterPicker';
import { Stats, choiceStats } from './Status';

// what gets sent to the front end

export interface Message { // needs name change
    characters: {
        name: string;
        currentHitPoints: number;
        maxHitPoints: number;
        art: number;
        profileImageURL: string;
        chatMessage: string;
        card: CharacterCard;
    }[];
    reel: GraphicsEvent[];
    patch?: number; // if this is defined then the reel is a patch at the specified time
}

export interface CharacterCard {
    readonly stats: choiceStats;
    readonly baseHealth: number;
    readonly bonusHealth: number;
    readonly className: string;
    readonly art: number;
    readonly level: number;
    readonly rarity: number;
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
    queue?: CharacterCard[];
}

export interface FrontToBackMessage {
    characterChoice?: CharacterChoice;
    requestReel?: true;
}

export interface StatBarAmount {
    amount: number;
    factor: number;
}