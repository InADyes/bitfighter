import { Combatant } from '../shared/Combatant';
import { Donation } from '../shared/interfaces/interfaces';
import { PendingChoice } from './CharacterChoiceHandler';

export interface BackendSettings {
    delayBetweenFights: number, // milliseconds
    minimumDonation: number,
    donationToHPRatio: number,
    defaultBossEmoticonURL: string,
    defaultBossMessage: string,
    defaultChampion: Donation,
    bitFighterEnabled: boolean,
    bitBossStartingHealth: number,
    characterNames: {[character: string]: string}
}

export interface GameSave {
    arena: Combatant[];
    queue: Combatant[];
    pendingChoices: PendingChoice[];
}
