import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { CharacterCard } from '../shared/interfaces/backToFrontMessage';

export class CardChoices {
    private cards: HTMLDivElement[];
    private timeout: number | null = null;

    constructor (
        private readonly cardDiv: HTMLDivElement,
        private readonly artURLs: string[],
        private readonly emitGameEvent: (message: FrontToBackMessage) => void,
        private readonly cardsTimeout: number
    ){}

    public displayCards(cards: HTMLDivElement[]) {
        if (this.timeout) {
            this.clearCards();
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.cards = cards;
        for (let i = 0; i < this.cards.length; i++) {
            this.cardDiv.appendChild(this.cards[i]);
            this.cards[i].addEventListener('click', () => {
                this.emitGameEvent({
                    characterChoice: {
                        choice: i
                }});
                this.clearCards();
            });
        }
        this.timeout = window.setTimeout(
            () => this.clearCards(),
            this.cardsTimeout // one minute
        );
    }
    private clearCards() {
        for (let card of this.cards) {
            this.cardDiv.removeChild(card);
        }
        this.cards = [];
    }
}

export function updateStatusCards(
    cards: {
        name: string;
        currentHitPoints: number;
        maxHitPoints: number;
        art: number;
        profileImageURL: string;
        bossMessage: string;
        card: CharacterCard;
    }[],
    artURLS: string[]
) {
    const newCard1 = cards[0] ? buildCard(cards[0].card, artURLS) : null;
    const newCard2 = cards[1] ? buildCard(cards[1].card, artURLS) : null;
    const oldCard1 = document.getElementById('card1');
    const oldCard2 = document.getElementById('card2');
    if (oldCard1 && newCard1) {

        oldCard1.classList.remove("empty-card");
        oldCard1.classList.add("card");
        oldCard1.innerHTML = newCard1.innerHTML;
    }
    else if (oldCard1) {
        oldCard1.classList.remove("card");
        oldCard1.classList.add("empty-card");
    }
    if (oldCard2 && newCard2) {
        oldCard2.classList.remove("empty-card");
        oldCard2.classList.add("card");
        oldCard2.innerHTML = newCard2.innerHTML;
    }
    else if (oldCard2) {
        oldCard2.classList.remove("card");
        oldCard2.classList.add("empty-card");
        oldCard2.innerHTML = "";
    }
}

export function buildCard(character: CharacterCard, artURLs: string[]) {
    let card = document.createElement('div');
    let stats = document.createElement('div');
    stats.className = 'character-card-stats';
    card.appendChild(stats);

    let charStats = Object.keys(character.stats).map(function(key, index){
        let x = `
        <div class="stat">
            <div class="title">${key}:</div>
            <div class="amount">
                <div class="amount-int">  ${ character.stats[key] }</div>
                ${healthBarSVG(   {amount: character.stats[key], factor:  10} )}
            </div>
        </div>`
        return x;
    }) 

    stats.innerHTML = `
    <div class="avatar">
        <div class="header-item">
            <img src="${artURLs[character.art]}" alt="${character.className}">
        </div>
        <div class="header-item header-wrap">
            <div class="header"> ${ character.className } </div>
        </div>
    </div>
    <div class="stats-container">
        
        <div class="stat">
            ${ character.flavorText }
        </div>
        ${charStats.join(' ')}
        <div class="stat">
            <div class="title">Level:</div>  
            <div class="amount">
                 <div class="amount-int">  ${ character.level }</div>
                  ${healthBarSVG({amount: character.level, factor: 10} )}
            </div>
        </div>
        <div class="stat">
            <div class="title">Health:</div> 
            <div class="amount">
                <div class="amount-int">  ${ character.baseHealth }    </div>
                ${healthBarSVG({amount: character.baseHealth, factor: 0.1} )}
            </div>
        </div>
        <div class="stat bonus">
            <div class="title">Bonus Health:</div>
            <div class="amount">
                <div class="amount-int"> ${ character.bonusHealth } </div>
                 ${healthBarSVG({amount: character.bonusHealth, factor: 0.1} )}
            </div>
        </div>
        <div class="stat">
            <div class="title">Rarity:</div>
            <div class="amount">
                ${ formatRarity[character.rarity] }
            </div>
        </div>
    </div>`;
    card.className = 'character-card';
    return card;
}

function healthBarSVG(amount: {
    amount: number;
    factor: number;
}) {
    return `
    <svg class="stat-svg" 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 50">
        <defs>
        <mask id="healthBarCutout">
            <rect x="144.72" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="130.25" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="115.77" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="101.3" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="86.83" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="72.36" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="57.89" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="43.42" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="28.94" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="14.47" y="5" width="8" height="40" rx="2" ry="2"/>
            <rect x="0" y="5" width="8" height="40" rx="2" ry="2"/>
        </mask>
        </defs>
        <rect class="main" width="${ amount.amount * amount.factor }%" height="100%" mask="url(#healthBarCutout)"/>
    </svg>`;
}

const formatRarity: {[details: number]: string} = {
    0: 'Common',
    1: 'Uncommon',
    2: 'Rare',
    3: 'Mythic',
    4: 'Grave Digger',
    5: 'BitBoss'
};