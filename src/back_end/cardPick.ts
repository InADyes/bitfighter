import { Character } from '../shared/characterPicker'

interface DonationTier {
    common: number,
    rare: number,
    epic: number,
    legendary: number
}

const tiers: {[details: string]: DonationTier} = {
    1: {
        common: 10,
        rare: 6,
        epic: 2,
        legendary: 0.5
    }
}

export function cardPick(
    donation: {
        id: number,
        name: string,
        amount: string
    },
    requestPick: (fanID: number, charcter: Character[]) => number
) {
    
}
