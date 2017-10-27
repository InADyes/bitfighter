import { GraphicsEvent } from './graphicsEvents';
import { Character, Stats } from './interfaces';
import { Rarity } from '../globals/rarity';

// what gets sent to the front end

export interface FrontendCharacter {
    name: string;
    className: string;
    currentHitPoints: number;
    maxHitPoints: number;
    art: string;
    profileImageURL: string;
    bossMessage: string;
    bossEmoticonURL: string;
    card: CharacterCard;
    id: string;
}

export interface ReelMessage { // needs name change
    characters: FrontendCharacter[];
    reel: GraphicsEvent[];
    patch?: number; // if this is defined then the reel is a patch at the specified time
}

export interface CharacterCard {
    readonly stats: {[stat: string]: number};
    readonly baseHealth: number;
    readonly bonusHealth: number;
    readonly className: string;
    readonly art: string;
    readonly level: number;
    readonly rarity: Rarity;
    readonly flavorText: string;
    readonly skillText: string;
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
    readonly stats: {[stat: string]: number},
    readonly className: string,
    readonly skillName: string,
    readonly skillURL: string,
    classArtURL: string, // needs to get shim prepended to it at front end
    readonly rarityName: string,
    readonly rarityColor: string,
    readonly flavorText: string
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
