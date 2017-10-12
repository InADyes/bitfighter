import { Event as GraphicsEvent } from '../graphicsEvents';
import { Character } from '../characterPicker';
import { Stats, choiceStats } from '../Status';

// what gets sent to the front end

export interface FrontendCharacter {
    name: string;
    className: string;
    currentHitPoints: number;
    maxHitPoints: number;
    art: number;
    profileImageURL: string;
    bossMessage: string;
    bossEmoticonURL: string;
    card: CharacterCard;
}

export interface ReelMessage { // needs name change
    characters: FrontendCharacter[];
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
    readonly flavorText: string;
    readonly buffArt: string,
    readonly buffName: string,
    bitBossCheerMote: boolean;
    selectable: boolean;
}

export interface QueueItem {
    readonly fanDisplayName: string;
    readonly championTypeName: string;
}

export interface CharacterListItem {
    stats: choiceStats,
    className: string,
    skillName: string,
    skillURL: string,
    rarityName: string,
    rarityColor: string,
    flavorText: string
}

export interface BackToFrontMessage {
    readonly newReel?: ReelMessage;
    readonly characterChoices?: CharacterCard[];
    readonly queue?: QueueItem[];
    readonly timer?: number;
    readonly updateBossMessage?: {
        readonly championIndex: number;
        readonly bossMessage: string;
    };
    readonly updateBossEmoticonURL?: {
        readonly championIndex: number;
        readonly bossEmoticonURL: string;
    };
    readonly characterList?: CharacterListItem[];
    readonly bossMessageChangeFailed?: true;
}
