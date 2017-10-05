import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import { Character, characters, pickCharacter, characterTypes } from '../shared/characterPicker';
import { Status } from '../shared/Status';
import { Donation } from '../shared/interfaces/donation';

interface DonationTier {
    donation: number;
    odds: {[details: number]: number};
    cards: number;
}

const enum e_rarity {
    common,
    rare,
    epic,
    legendary
}

const rarities = [0, 1, 2, 3];

const tiers: DonationTier[] = [
    {
        donation: 10000,
        odds: {
            [e_rarity.common]: 0,
            [e_rarity.rare]: 0,
            [e_rarity.epic]: 15,
            [e_rarity.legendary]: 10,
        },
        cards: 3
    },
    {
        donation: 5000,
        odds: {
            [e_rarity.common]: 0,
            [e_rarity.rare]: 6,
            [e_rarity.epic]: 10,
            [e_rarity.legendary]: 7.5
        },
        cards: 3
    },
    {
        donation: 1000,
        odds: {
            [e_rarity.common]: 0,
            [e_rarity.rare]: 9,
            [e_rarity.epic]: 8.75,
            [e_rarity.legendary]: 5
        },
        cards: 3
    },
    {
        donation: 500,
        odds: {
            [e_rarity.common]: 5,
            [e_rarity.rare]: 6,
            [e_rarity.epic]: 7.5,
            [e_rarity.legendary]: 2.5
        },
        cards: 3
    },
    {
        donation: 200,
        odds: {
            [e_rarity.common]: 10,
            [e_rarity.rare]: 6,
            [e_rarity.epic]: 2,
            [e_rarity.legendary]: 0.5
        },
        cards: 3
    },
    {
        donation: 0,
        odds: {
            [e_rarity.common]: 100,
            [e_rarity.rare]: 0,
            [e_rarity.epic]: 0,
            [e_rarity.legendary]: 0,
        },
        cards: 1
    },
];

export class CharacterChoiceHandler {
    private pendingCharacterChoices: {
        id: number,
        characters: Status[],
        timeout: NodeJS.Timer
    }[] = [];

    constructor(
        private readonly newCombatant: (status: Status) => void,
        private readonly requestPick: (choices: CharacterCard[], id: number) => void
    ) {}

    public requestChoice(donation: Donation) {
        if (this.pendingCharacterChoices.find(c => c.id === donation.id) !== undefined)
            return; // todo: what should happen if they donate while they still have cards?

        //find last tier that we can achive or use the first one
        const { odds, cards } = tiers.find(t => t.donation <= donation.amount) || tiers[5];
        //total odds of reach rarity
        const totals = rarities.map(r => odds[r] * characters.filter(c => c.rarity == r).length);
        
        //total odds
        const total = totals.reduce((previous, current) => previous + current);
    
        let choices: Character[] = [];
    
        //todo: validate math
        // for every choice to be given
        for (let _ = 0; _ < cards; _++) {
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

        const statusChoices = choices.map(c => pickCharacter({
            id: donation.id,
            name: donation.name,
            amount: donation.amount,
            profileImageURL: donation.profileImageURL,
            bossMessage: donation.profileImageURL,
            bossEmoticonURL: donation.bossEmoticonURL
        }, characters.indexOf(c)));
        
        const timeout = setTimeout(
            () => {
                // clear timeout somehow
                this.completeChoice(donation.id, Math.floor(choices.length * Math.random()))
            },
            60000 // one minute
        );

        this.pendingCharacterChoices.push({
            id: donation.id,
            characters: statusChoices,
            timeout
        });

        this.requestPick(
            statusChoices.map(s => s.card),
            donation.id
        );
    }
    public completeChoice(id: number, pick: number, clear?: boolean) {
        const index = this.pendingCharacterChoices.findIndex(c => c.id === id);

        if (index === -1) {
            console.error('no pending choice for this pick');
            return;
        }

        const pendingChoice = this.pendingCharacterChoices.splice(index, 1)[0];
        
        if (clear && clear === true)
            clearTimeout(pendingChoice.timeout);

        this.newCombatant(pendingChoice.characters[pick % pendingChoice.characters.length]);
    }
}
