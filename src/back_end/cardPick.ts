import * as CharacterPicker from '../shared/characterPicker'

interface DonationTier {
    donation: number,
    odds: {[details: number]: number};
}

const enum e_rarity {
    common,
    rare,
    epic,
    legendary
}

const rarities = [0, 1, 2, 3];

e_rarity.common

const tiers: DonationTier[] = [
    {
        donation: 200,
        odds: {
            [e_rarity.common]: 10,
            [e_rarity.rare]: 6,
            [e_rarity.epic]: 2,
            [e_rarity.legendary]: 0.5
        }
    }
]

export function cardPick(
    donation: {
        id: number,
        name: string,
        amount: number
    },
    requestPick: (fanID: number, charcter: CharacterPicker.Character[]) => number
) {
    //find last tier that we can achive or use the first one
    const odds = (tiers.reverse().find(t => t.donation >= donation.amount) || tiers[0]).odds;

    let total = rarities.map(r => odds[r] * CharacterPicker.characters
        .filter(c => c.rarity == r).length)
        .reduce((previous, current) => previous + current);
    console.log('total: ', total);
}
