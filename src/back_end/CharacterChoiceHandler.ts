import { characterSheets } from '../shared/globals/characterSheets';
import { rarityInfo, Rarity, rarities } from '../shared/globals/rarity';
import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import {
    characterTypes,
    pickCharacter
} from '../shared/characterPicker';
import { Combatant } from '../shared/Combatant';
import { Donation, Item, Character } from '../shared/interfaces/interfaces';
import { BackendSettings } from './interfaces';

interface DonationTier {
    donation: number;
    odds: {[R in Rarity]: number};
    cards: number;
}

const tiers: DonationTier[] = [
    {
        donation: 10000,
        odds: {
            'common': 0,
            'uncommon': 0,
            'rare': 15,
            'mythic': 10,
            'graveDigger': 0,
            'bitBoss': 0
        },
        cards: 3
    },
    {
        donation: 5000,
        odds: {
            'common': 0,
            'uncommon': 6,
            'rare': 10,
            'mythic': 7.5,
            'graveDigger': 0,
            'bitBoss': 0
        },
        cards: 3
    },
    {
        donation: 1000,
        odds: {
            'common': 0,
            'uncommon': 9,
            'rare': 8.75,
            'mythic': 5,
            'graveDigger': 0,
            'bitBoss': 0
        },
        cards: 3
    },
    {
        donation: 500,
        odds: {
            'common': 5,
            'uncommon': 6,
            'rare': 7.5,
            'mythic': 2.5,
            'graveDigger': 0,
            'bitBoss': 0
        },
        cards: 3
    },
    {
        donation: 200,
        odds: {
            'common': 10,
            'uncommon': 6,
            'rare': 2,
            'mythic': 0.5,
            'graveDigger': 0,
            'bitBoss': 0
        },
        cards: 3
    },
    {
        donation: 0,
        odds: {
            'common': 100,
            'uncommon': 0,
            'rare': 0,
            'mythic': 0,
            'graveDigger': 0,
            'bitBoss': 0
        },
        cards: 2
    },
];

export interface PendingChoice {
    id: string,
    characters: Combatant[],
    timeout: NodeJS.Timer
}

export class CharacterChoiceHandler {
    public pendingCharacterChoices: PendingChoice[] = [];

    constructor(
        private readonly newCombatant: (combatant: Combatant) => void,
        private readonly requestPick: (choices: CharacterCard[], id: string) => void,
        private readonly settings: BackendSettings
    ) {}

    public clearTimeouts() {
        for (let choice of this.pendingCharacterChoices) {
            global.clearTimeout(choice.timeout);
        }
    }

    public requestChoice(donation: Donation, ...items: Item[]) {
        if (this.pendingCharacterChoices.find(c => c.id === donation.id) !== undefined)
            return; // todo: what should happen if they donate while they still have cards?

        //find last tier that we can achive or use the first one
        const { odds, cards } = tiers.find(t => t.donation <= donation.amount) || tiers[5];
        //total odds of reach rarity
        const totals = rarities.map(r => odds[r as Rarity] * characterSheets.filter(c => c.rarity === r).length);
        
        //total odds
        const total = totals.reduce((previous, current) => previous + current);
    
        const choices: Character[] = [];
    
        //todo: validate math
        // for every choice to be given
        for (let _ = 0; _ < cards; _++) {
            let roll = Math.floor((total + 1) * Math.random());
            let choice: Character | null = null;
    
            //reduce roll by total rarity odds untill rarity is found
            for (let i = 0; i < rarities.length; i++) {

                if (roll < totals[i]) {
                    roll /= odds[rarities[i]];
                    choice = characterSheets.filter(c => c.rarity === rarities[i])[Math.floor(roll)];
                    break;
                }
                roll -= totals[i];
            }
            // quick hack to get rid of duplicate characterSheets

            // if it's the last card then redo the pick if it's common
            if (_ === cards && choice && choice.rarity === 'common') {
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

        const combatantChoices = choices.map(c => pickCharacter(
            donation,
            characterSheets.indexOf(c),
            this.settings.characterNames,
            ...items
        ));

        const choiceCards = combatantChoices.map(s => s.card);
        const lastCard = choiceCards[choiceCards.length - 1];
        lastCard.bitBossCheerMote = true;
        lastCard.selectable = donation.bitBossCheerMote ? true : false;

        //send the choices to the front end
        this.requestPick(
            choiceCards,
            donation.id
        );

        // if they didn't use the bitboss chearmote remove the last choice
        if (donation.bitBossCheerMote === false)
            combatantChoices.pop();

        this.pendingCharacterChoices.push({
            id: donation.id,
            characters: combatantChoices,
            timeout: global.setTimeout(
                // clear timeout somehow
                () => this.completeChoice(donation.id, Math.floor(choices.length * Math.random())),
                // one minute with some buffer
                61000
            )
        });
    }
    public hasPendingChoice(id: string) {
        return this.pendingCharacterChoices.some(c => c.id === id);
    }

    public completeChoice(id: string, pick: number, clear?: boolean) {
        let index = this.pendingCharacterChoices.findIndex(c => c.id === id);

        if (index === -1) {
            console.error('no pending choice for this pick');
            return;
        }

        const pendingChoice = this.pendingCharacterChoices.splice(index, 1)[0];
        
        if (clear && clear === true)
            global.clearTimeout(pendingChoice.timeout);

        this.newCombatant(pendingChoice.characters[pick % pendingChoice.characters.length]);
    }
}
