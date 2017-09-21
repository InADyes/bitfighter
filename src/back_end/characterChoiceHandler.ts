import { Character, characters } from '../shared/characterPicker';

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
];

export class characterChoiceHandler {
    private pendingCharacterChoices: {
        id: number,
        characters: number[]
    }[];
    public requestChoice(
        donation: {
            id: number,
            name: string,
            amount: number
        },
        requestPick: (id: number, character: Character[]) => number
    ) {
        //find last tier that we can achive or use the first one
        const odds = (tiers.reverse().find(t => t.donation >= donation.amount) || tiers[0]).odds;
    
        //total odds of reach rarity
        const totals = rarities.map(r => odds[r] * characters.filter(c => c.rarity == r).length);
        
        //total odds
        const total = totals.reduce((previous, current) => previous + current);
    
        let choices: Character[] = [];
    
    
        console.log('total: ', total);
    
        // for every choice to be given
        for (let _ = 0; _ < 3; _++) {
            let roll = Math.floor((total + 1) * Math.random());
    
            //reduce roll by total rarity odds untill rarity is found
            for (let rarity = 0; rarity < totals.length; rarity++) {
                if (roll < totals[rarity]) {
                    roll /= odds[rarity];
                    choices.push(characters.filter(c => c.rarity === rarity)[roll]);
                    break;
                }
                roll -= totals[rarity];
            }
        }
        
        this.pendingCharacterChoices.push({
            id: donation.id,
            characters: choices.map(c => characters.indexOf(c))
        });

        return requestPick(donation.id, choices);
    }
    public completeChoice() {

    }
}
