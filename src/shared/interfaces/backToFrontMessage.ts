import { Event as GraphicsEvent } from '../graphicsEvents';
import { Character } from '../characterPicker';
import { Stats, choiceStats } from '../Status';

// what gets sent to the front end

export interface ReelMessage { // needs name change
    characters: {
        name: string;
        currentHitPoints: number;
        maxHitPoints: number;
        art: number;
        profileImageURL: string;
        bossMessage: string;
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

export interface BackToFrontMessage {
    readonly newReel?: ReelMessage;
    readonly characterChoices?: CharacterCard[];
    readonly queue?: {
        readonly queue: {
            readonly fanDisplayName: string;
            readonly championTypeName: string;
        }[];
        readonly timer?: number;
    };
    readonly updateBossMessage?: {
        readonly championIndex: number;
        readonly bossMessage: string;
    }
    readonly updateBossEmoticonURL?: {
        readonly championIndex: number;
        readonly bossEmoticonURL: string;
    }
}
