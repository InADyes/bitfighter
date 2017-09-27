import { CharacterChoices } from '../shared/frontEndMessage';
import { Character, characters, pickCharacter } from '../shared/characterPicker';
import { Status } from '../shared/Status';

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
        characters: Status[],
        timeout: number
    }[] = [];

    constructor(
        private readonly newCombatant: (status: Status) => void,
        private readonly requestPick: (choices: CharacterChoices, id: number) => void
    ) {}

    public requestChoice(
        donation: {
            id: number,
            name: string,
            amount: number
        }
    ) {
        if (this.pendingCharacterChoices.find(c => c.id === donation.id) !== undefined)
            return; // todo: what should happen if they donate while they still have cards?

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

        let statusChoices = choices.map(c => pickCharacter({
            id: donation.id,
            name: donation.name,
            amount: donation.amount,
            character: characters.indexOf(c)
        }));
        
        const timeout = window.setTimeout(
            () => {
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
            {
                characters: statusChoices.map(s => ({
                    stats: s.baseStats,
                    className: characters[s.character].name,
                    art: s.character,
                    level: s.level
                }))
            },
            donation.id
        );
    }
    public completeChoice(id: number, pick: number) {
        const index = this.pendingCharacterChoices.findIndex(c => c.id === id);

        if (index === -1) {
            console.error('no pending choice for this pick');
            return;
        }

        const pendingChoice = this.pendingCharacterChoices.splice(index, 1)[0];

        this.newCombatant(pendingChoice.characters[pick % pendingChoice.characters.length]);
    }
}
