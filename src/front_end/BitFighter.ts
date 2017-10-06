import { characters, buffArt, artURLs } from '../shared/characterPicker';
import { GameState } from './gamestate/Gamestate';
import {
    BackToFrontMessage,
    CharacterCard,
} from '../shared/interfaces/backToFrontMessage';
import {
    CharacterChoice,
    FrontToBackMessage
} from '../shared/interfaces/frontToBackMessage';

import { FrontEndSettings as Settings } from './settings';

declare function flip(side: 'front' | 'back'): void;

export class BitFighter {
    private readonly game: GameState;
    //private canvas: HTMLCanvasElement = document.createElement('canvas');
    private canvas = document.getElementById('arena');
    private cards: HTMLDivElement[] = [];
    private timeout: number | null = null;
    private readonly artURLs: string[];
    private readonly iconURLs: string[];

    constructor(
        private readonly wrapperDiv: HTMLDivElement,
        private settings: Settings,
        // todo: find out what gameslug is for
        private readonly emitGameEvent: (gameSlug: string, message: FrontToBackMessage) => void,
        private readonly cardDiv: HTMLDivElement
    ) {
 
        this.artURLs = artURLs.map(url => this.settings.assetsShim + url);
        this.iconURLs = buffArt.map(url => this.settings.assetsShim + url);
        this.game = new GameState('arena', this.artURLs, this.iconURLs);
        this.updateSettings(settings);
        window.addEventListener('resize', () => {
            this.updateScale();
        });
        setTimeout(() => {this.emitGameEvent('bitFighter', {requestReel: true})}, 1000);
    }
    public receivedViewerGameState(data: BackToFrontMessage) {
        if (data.newReel) {
            this.game.newMessage(data.newReel);
            //this.game.newMessage(data.newReel.reel, data.newReel.characters, data.newReel.patch);
            // update character cards
            if (!data.newReel.patch)
                updateCards(data.newReel.characters, this.artURLs);
        }
        if (data.characterChoices) {
            flip('back');
            if (this.timeout) {
                this.clearCards();
            }
            this.cards = data.characterChoices.map(c => buildCard(c, this.artURLs));
            for (let i = 0; i < this.cards.length; i++) {
                this.cardDiv.appendChild(this.cards[i]);
                this.cards[i].addEventListener('click', () => {
                    this.emitGameEvent('bitFighter', {
                        characterChoice: {
                            choice: i
                    }});
                    this.clearCards();
                });
            }
            
            this.timeout = window.setTimeout(
                () => {
                    this.clearCards();
                },
                this.settings.cardsTimeout // one minute
            );
        }
        if (data.queue) {
            if (data.queue.queue) {
                let q = document.getElementById('queue');
                if (q) {
                    q.innerText = "NEXT\n";
                    for (let i = 0; i < data.queue.queue.length; i++) {
                        q.innerText += data.queue.queue[i].fanDisplayName + ' - ' + data.queue.queue[i].championTypeName + '\n';
                    }
                }
            }
            if (data.queue.timer)
                this.game.startTimer(data.queue.timer);
        }
        if (data.updateBossMessage) {
            this.game.updateBossMessage(data.updateBossMessage.championIndex, data.updateBossMessage.bossMessage);
        }
        if (data.updateBossEmoticonURL){
            this.game.updateEmote(data.updateBossEmoticonURL.championIndex, data.updateBossEmoticonURL.bossEmoticonURL);
        }
        if (data.characterList) {
            //use a kieth global func to send him the entire char list
        }
    }
    private clearCards() {
        for (let card of this.cards) {
            this.cardDiv.removeChild(card);
        }
        this.cards = [];
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
    public updateSettings(settings: Settings) {
        this.settings = settings;
        this.updateScale();
    }
    private updateScale() {
        const scale = this.wrapperDiv.offsetHeight / 400;
        this.wrapperDiv.style.fontSize = 12 * scale + 'px';
        this.game.setNewScale(scale);
    }
}

function updateCards(cards: {
    name: string;
    currentHitPoints: number;
    maxHitPoints: number;
    art: number;
    profileImageURL: string;
    bossMessage: string;
    card: CharacterCard;
}[], artURLS: string[]) {
    let newCard1 = buildCard(cards[0].card, artURLS);
    let newCard2 = null;
    if (cards[1])
        newCard2 = buildCard(cards[1].card, artURLs);
    let oldCard1 = document.getElementById('card1');
    let oldCard2 = document.getElementById('card2');

    if (oldCard1)
        oldCard1.innerHTML = newCard1.innerHTML;
    if (oldCard2 && newCard2)
        oldCard2.innerHTML = newCard2.innerHTML;
}

function buildCard(character: CharacterCard, artURLs: string[]) {
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
        <img src="${artURLs[character.art]}" alt="${character.className}">
    </div>
    <div class="stats-container">
        <div class="header"> ${ character.className } </div>
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
    3: 'Mythic'
} 