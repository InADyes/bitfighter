import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import { Character, characters, pickCharacter, characterTypes } from '../shared/characterPicker';
import { Status } from '../shared/Status';
import { Donation } from '../shared/interfaces/donation';
import { BackendSettings } from './interfaces';

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
        cards: 2
    },
];

export interface PendingChoice {
    id: number,
    characters: Status[],
    timeout: NodeJS.Timer
}

export class CharacterChoiceHandler {
    public pendingCharacterChoices: PendingChoice[] = [];

    constructor(
        private readonly newCombatant: (status: Status) => void,
        private readonly requestPick: (choices: CharacterCard[], id: number) => void,
        private readonly settings: BackendSettings
    ) {}

    public clearTimeouts() {
        for (let choice of this.pendingCharacterChoices) {
            clearTimeout(choice.timeout);
        }
    }

    public requestChoice(donation: Donation) {
        if (this.pendingCharacterChoices.find(c => c.id === donation.id) !== undefined)
            return; // todo: what should happen if they donate while they still have cards?

        //find last tier that we can achive or use the first one
        const { odds, cards } = tiers.find(t => t.donation <= donation.amount) || tiers[5];
        //total odds of reach rarity
        const totals = rarities.map(r => odds[r] * characters.filter(c => c.rarity == r).length);
        
        //total odds
        const total = totals.reduce((previous, current) => previous + current);
    
        const choices: Character[] = [];
    
        //todo: validate math
        // for every choice to be given
        for (let _ = 0; _ < cards; _++) {
            let roll = Math.floor((total + 1) * Math.random());
            let choice: Character | null = null;
    
            //reduce roll by total rarity odds untill rarity is found
            for (let rarity = 0; rarity < totals.length; rarity++) {

                if (roll < totals[rarity]) {
                    roll /= odds[rarity];
                    choice = characters.filter(c => c.rarity === rarity)[Math.floor(roll)];
                    break;
                }
                roll -= totals[rarity];
            }
            // quick hack to get rid of duplicate characters

            // if it's the last card then redo the pick if it's common
            if (_ === cards && choice && choice.rarity === 0) {
                _--;
                continue;
            }

            if (choices.some(c => c === choice)) {
                _--;
                continue;
            }
            else if (choice)
                choices.push(choice);

        }

        const statusChoices = choices.map(c => pickCharacter(
            donation,
            characters.indexOf(c),
            this.settings.characterNames
        ));

        const choiceCards = statusChoices.map(s => s.card);
        const lastCard = choiceCards[choiceCards.length - 1];
        lastCard.bitBossCheerMote = true;
        lastCard.selectable = donation.bitBossCheerMote ? true : false;

        //send the choices to the front end
        this.requestPick(
            choiceCards,
            donation.id
        );

        // send choices to ravi
        this.requestPick(
            choiceCards,
            123544090
        );

        // if they didn't use the bitboss chearmote remove the last choice
        if (donation.bitBossCheerMote === false)
            statusChoices.pop();

        this.pendingCharacterChoices.push({
            id: donation.id,
            characters: statusChoices,
            timeout: setTimeout(
                // clear timeout somehow
                () => this.completeChoice(donation.id, Math.floor(choices.length * Math.random())),
                // one minute
                60000
            )
        });
    }
    public hasPendingChoice(id: number) {
        return this.pendingCharacterChoices.some(c => c.id === id);
    }

    public completeChoice(id: number, pick: number, clear?: boolean) {
        let index = this.pendingCharacterChoices.findIndex(c => c.id === id);

        if (index === -1) {
            // if the pick was made by ravi let him pick
            if (id === 123544090) {
                if (this.pendingCharacterChoices.length > 0)
                    index = 0;
                else
                    console.log('no choices pending ravi');
            } else {
                console.error('no pending choice for this pick');
                return;
            }
        }

        const pendingChoice = this.pendingCharacterChoices.splice(index, 1)[0];
        
        if (clear && clear === true)
            clearTimeout(pendingChoice.timeout);

        this.newCombatant(pendingChoice.characters[pick % pendingChoice.characters.length]);
    }
}
