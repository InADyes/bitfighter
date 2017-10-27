import { Combatant } from '../shared/Combatant';
import { Donation } from '../shared/interfaces/interfaces';
import { PendingChoice } from './CharacterChoiceHandler';
import { FrontEndSettings } from '../shared/interfaces/backToFrontMessage';

export interface BackendSettings {
    delayBetweenFights: number; // milliseconds
    minimumDonation: number;
    donationToHPRatio: number;
    defaultBossEmoticonURL: string;
    defaultBossMessage: string;
    defaultChampion: Donation;
    bitFighterEnabled: boolean;
    bitBossStartingHealth: number;
    characterNames: {[character: string]: string};
    characterArt: {[character: string]: string};
    assetPathPrefix: string;
    frontendSettings: FrontEndSettings;
}

export interface GameSave {
    arena: Combatant[];
    queue: Combatant[];
    pendingChoices: PendingChoice[];
}
