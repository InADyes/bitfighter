import { Donation } from '../shared/interfaces/donation';
import { BackendSettings } from './interfaces';

export function validateDonation(donation: Donation): {donation: Donation, err: boolean} {

    let {
        id,
        name,
        amount,
        profileImageURL,
        bossMessage,
        bossEmoticonURL,
        bitBossCheerMote
    } = donation;

    const err = false === isValid(donation, {
        id: 'number',
        name: 'string',
        amount: 'number',
        profileImageURL: 'string',
        bossMessage: 'string',
        bossEmoticonURL: 'string',
        bitBossCheerMote: 'boolean'
    });


    if (id === 123544090)
        name = 'Ravioli';

    if (profileImageURL === '')
        profileImageURL = 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png';

    return {
        donation: {
            id,
            name,
            amount,
            profileImageURL,
            bossMessage,
            bossEmoticonURL,
            bitBossCheerMote
        },
        err
    };
}

export function validateSettings(settings: BackendSettings): {settings: BackendSettings, err?: boolean} {
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

    const result = validateDonation(defaultChampion);
    settings.defaultChampion = result.donation;

    const err = false === isValid(settings, {
        delayBetweenFights: 'number',
        minimumDonation: 'number',
        donationToHPRatio: 'number',
        defaultBossEmoticonURL: 'string',
        defaultBossMessage: 'string',
        defaultChampion: 'object',
        bitFighterEnabled: 'boolean',
        bitBossStartingHealth: 'number',
        characterNames: 'object'
    }) || result.err;

    return {
        settings: {
            delayBetweenFights,
            minimumDonation,
            donationToHPRatio,
            defaultBossEmoticonURL,
            defaultBossMessage,
            defaultChampion,
            bitFighterEnabled,
            bitBossStartingHealth,
            characterNames
        },
        err
    }
}

type Validator<T> = {
    readonly [K in keyof T]: 'number' | 'string' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
}

function isValid<T>(validateMe: T, types: Validator<T>): boolean {
    for (let key in validateMe) {
        if (types[key] !== typeof(validateMe[key])) {
            console.error(`${ key } is of type ${ typeof(validateMe[key]) }, and should be ${ types[key] }`)
            return false;
        }
    }
    return true;
}
