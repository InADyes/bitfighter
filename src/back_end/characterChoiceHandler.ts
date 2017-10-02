import { CharacterCard } from '../shared/frontEndMessage';
import { Character, characters, pickCharacter, characterTypes } from '../shared/characterPicker';
import { Status } from '../shared/Status';

export type choiceStats = {[detials: string]: number};

const cardStats: {[details: number]: choiceStats} = {
    [characterTypes.scullaryMaid]: {
        accuracy: 6,
        dodge: 6,
        armor: 5,
        damage: 5,
        attackSpeed: 5
    },
    [characterTypes.barkeep]: {
        accuracy: 3,
        dodge: 4,
        armor: 8,
        damage: 6,
        attackSpeed: 3
    },
    [characterTypes.medium]: {
        accuracy: 5,
        dodge: 6,
        armor: 1,
        damage: 3,
        attackSpeed: 7
    },
    [characterTypes.minstrel]: {
        accuracy: 5,
        dodge: 6,
        armor: 2,
        damage: 5,
        attackSpeed: 8
    },
    [characterTypes.mage]: {
        accuracy: 10,
        dodge: 4,
        armor: 5,
        damage: 2,
        attackSpeed: 10
    },
    [characterTypes.rogue]: {
        accuracy: 8,
        dodge: 8,
        armor: 3,
        damage: 1,
        attackSpeed: 9
    },
    [characterTypes.warpriest]: {
        accuracy: 3,
        dodge: 3,
        armor: 10,
        damage: 3,
        attackSpeed: 4
    },
    [characterTypes.warlock]: {
        accuracy: 2,
        dodge: 2,
        armor: 5,
        damage: 9,
        attackSpeed: 2
    },
    [characterTypes.swashbuckler]: {
        accuracy: 7,
        dodge: 8,
        armor: 3,
        damage: 6,
        attackSpeed: 6
    },
    [characterTypes.dragon]: {
        accuracy: 1,
        dodge: 1,
        armor: 8,
        damage: 10,
        attackSpeed: 1
    },
}

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
        donation: 500,
        odds: {
            [e_rarity.common]: 5,
            [e_rarity.rare]: 6,
            [e_rarity.epic]: 7.5,
            [e_rarity.legendary]: 2.5
        },
        cards: 4
    },
    {
        donation: 1000,
        odds: {
            [e_rarity.common]: 0,
            [e_rarity.rare]: 9,
            [e_rarity.epic]: 8.75,
            [e_rarity.legendary]: 5
        },
        cards: 5
    },
    {
        donation: 5000,
        odds: {
            [e_rarity.common]: 0,
            [e_rarity.rare]: 6,
            [e_rarity.epic]: 10,
            [e_rarity.legendary]: 7.5
        },
        cards: 6
    },
    {
        donation: 1000,
        odds: {
            [e_rarity.common]: 0,
            [e_rarity.rare]: 0,
            [e_rarity.epic]: 15,
            [e_rarity.legendary]: 10
        },
        cards: 7
    }
];

export class CharacterChoiceHandler {
    private pendingCharacterChoices: {
        id: number,
        characters: Status[],
        timeout: number
    }[] = [];

    constructor(
        private readonly newCombatant: (status: Status) => void,
        private readonly requestPick: (choices: CharacterCard[], id: number) => void
    ) {}

    public requestChoice(
        donation: {
            id: number,
            name: string,
            amount: number,
            profileImageURL: string,
            chatMessage: string
        }
    ) {
        if (this.pendingCharacterChoices.find(c => c.id === donation.id) !== undefined)
            return; // todo: what should happen if they donate while they still have cards?

        //find last tier that we can achive or use the first one
        const { odds, cards } = tiers.reverse().find(t => t.donation >= donation.amount) || tiers[0];
    
        //total odds of reach rarity
        const totals = rarities.map(r => odds[r] * characters.filter(c => c.rarity == r).length);
        
        //total odds
        const total = totals.reduce((previous, current) => previous + current);
    
        let choices: Character[] = [];
    
    
        console.log('total: ', total);
    
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
            character: characters.indexOf(c),
            profileImageURL: donation.profileImageURL,
            chatMessage: donation.profileImageURL
        }));
        
        const timeout = <any>setTimeout(
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
            statusChoices.map(s => ({
                stats: cardStats[s.character] || cardStats[-1],
                baseHealth: characters[s.character].stats.maxHitPoints,
                bonusHealth: s.baseStats.maxHitPoints - characters[s.character].stats.maxHitPoints,
                className: characters[s.character].name,
                art: s.character,
                level: s.level,
                rarity: characters[s.character].rarity
            })),
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
            <any>clearTimeout(pendingChoice.timeout);

        this.newCombatant(pendingChoice.characters[pick % pendingChoice.characters.length]);
    }
}
