import { Donation } from '../shared/interfaces/donation';
import { BackendSettings } from './interfaces';

export function validateDonation(donation: Donation): Donation {

    let {
        id,
        name,
        amount,
        profileImageURL,
        bossMessage,
        bossEmoticonURL,
        bitBossCheerMote
    } = donation;


    if (id === 123544090)
        name = 'Ravioli';

    if (profileImageURL === '')
        profileImageURL = 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png';

    return {
        id,
        name,
        amount,
        profileImageURL,
        bossMessage,
        bossEmoticonURL,
        bitBossCheerMote
    };
}

export function validateSettings(settings: BackendSettings): BackendSettings {
    let {
        delayBetweenFights,
        minimumDonation,
        donationToHPRatio,
        defaultBossEmoticonURL,
        defaultBossMessage,
        defaultChampion,
        bitFighterEnabled,
        bitBossStartingHealth,
        characterNames
    } = settings;

    defaultChampion = validateDonation(defaultChampion);

    return {
        delayBetweenFights,
        minimumDonation,
        donationToHPRatio,
        defaultBossEmoticonURL,
        defaultBossMessage,
        defaultChampion,
        bitFighterEnabled,
        bitBossStartingHealth,
        characterNames
    }
}
