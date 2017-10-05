import { Donation } from '../shared/interfaces/donation';

export interface BackendSettings {
    delayBetweenFights: number, // milliseconds
    minimumDonation: number,
    donationToHPRatio: number,
    defaultBossEmoticonURL: string,
    defaultBossMessage: string,
    defaultChampion: Donation
}
