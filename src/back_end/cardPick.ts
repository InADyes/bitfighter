import { Character, characters } from '../shared/characterPicker'

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
    requestPick: (fanID: number, character: Character[]) => number
) {
    //find last tier that we can achive or use the first one
    const odds = (tiers.reverse().find(t => t.donation >= donation.amount) || tiers[0]).odds;

    const totals = rarities.map(r => odds[r] * characters.filter(c => c.rarity == r).length);
    
    const total = totals.reduce((previous, current) => previous + current);

    let choices: Character[] = [];


    console.log('total: ', total);

    // for every choice to be given
    for (let _ = 0; _ < 3; _++) {
        let roll = Math.floor((total + 1) * Math.random());

        //reduce roll by total rarity odds untill rarity is found
        for (let i in totals) {
            if (roll < totals[i]) {
                roll /= odds[i];
                choices.push(characters[i]);
                break;
            }
            roll -= odds[i];
        }
    }

    return choices[requestPick(donation.id, choices)];
}
