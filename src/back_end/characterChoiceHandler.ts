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

export class CharacterChoiceHandler {
    private pendingCharacterChoices: {
        id: number,
        characters: number[],
        timeout: NodeJS.Timer,
        name: string,
        donationAmount: number
    }[] = [];

    constructor(
        private readonly newCombatant: (donation: {
            id: number,
            name: string,
            amount: number,
            character: number
        }) => void,
        private readonly requestPick: (id: number, character: Character[]) => void
    ) {}

    public requestChoice(
        donation: {
            id: number,
            name: string,
            amount: number
        }
    ) {
        //find last tier that we can achive or use the first one
        const odds = (tiers.reverse().find(t => t.donation >= donation.amount) || tiers[0]).odds;
    
        //total odds of reach rarity
        const totals = rarities.map(r => odds[r] * characters.filter(c => c.rarity == r).length);
        
        //total odds
        const total = totals.reduce((previous, current) => previous + current);
    
        let choices: Character[] = [];
    
    
        console.log('total: ', total);
    
        //todo: validate math

        // for every choice to be given
        for (let _ = 0; _ < 3; _++) {
            let roll = Math.floor((total + 1) * Math.random());
    
            //reduce roll by total rarity odds untill rarity is found
            for (let rarity = 0; rarity < totals.length; rarity++) {
                if (roll < totals[rarity]) {
                    roll /= odds[rarity];
                    choices.push(characters.filter(c => c.rarity === rarity)[Math.floor(roll)]);
                    break;
                }
                roll -= totals[rarity];
            }
        }
        
        const timeout = setTimeout(
            () => {
                this.completeChoice(donation.id, Math.floor((choices.length + 1) * Math.random()))
            },
            60000 // one minute
        );

        this.pendingCharacterChoices.push({
            id: donation.id,
            characters: choices.map(c => characters.indexOf(c)),
            timeout,
            name: donation.name,
            donationAmount: donation.amount
        });

        this.requestPick(donation.id, choices);
    }
    public completeChoice(id: number, pick: number) {
        const index = this.pendingCharacterChoices.findIndex(c => c.id === id);

        if (index === -1) {
            console.error('no pending choice for this pick');
            return;
        }

        const pendingChoice = this.pendingCharacterChoices.splice(index, 1)[0];
        const characters = pendingChoice.characters;

        const character = characters[pick % characters.length];
        this.newCombatant({
            id,
            character,
            amount: pendingChoice.donationAmount,
            name: pendingChoice.name
        });
    }
}
