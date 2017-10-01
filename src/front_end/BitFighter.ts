import { characters } from '../shared/characterPicker';
import { GameState } from './gamestate/Gamestate';
import {
    BackToFrontMessage,
    CharacterCard,
    CharacterChoice,
    FrontEndSettings as Settings,
    FrontToBackMessage,
    StatBarAmount
} from '../shared/frontEndMessage';
import { choiceStats } from '../back_end/characterChoiceHandler';

export class BitFighter {
    private readonly game: GameState;
    private canvas: HTMLCanvasElement = document.createElement('canvas');
    private cards: HTMLDivElement[] = [];
    private timeout: number | null = null;
    private artURLs: string[];
    private iconURLs: string[];

    constructor(
        private readonly wrapperDiv: HTMLDivElement,
        private settings: Settings,
        // todo: find out what gameslug is for
        private readonly emitGameEvent: (gameSlug: string, message: FrontToBackMessage) => void
    ) {
        // build arena
        this.canvas.id = 'arena';
        this.canvas.style.position = 'absolute';
        this.wrapperDiv.appendChild(this.canvas);
        this.artURLs = artURLs.map(url => this.settings.assetsShim + url);
        this.iconURLs = buffArt.map(url => this.settings.assetsShim + url);
        this.game = new GameState('arena', this.artURLs, this.iconURLs);
        this.updateSettings(settings);
        window.addEventListener('resize', () => {
            this.updateScale();
        });
    }
    public receivedViewerGameState(data: BackToFrontMessage) {
        if (data.newReel) {
            this.game.newMessage(data.newReel.reel, data.newReel.characters, data.newReel.patch);
        }
        // temp hack to be replaced by using proper socket events for each emit type
        // only shows card if fan id matches
        if (data.characterChoices && data.id === parseInt(achievements.fan_platform_id, 10)) {
            if (this.timeout) {
                this.clearCards();
            }
            this.cards = data.characterChoices.map(c => buildCard(c));
            for (let i = 0; i < this.cards.length; i++) {
                this.wrapperDiv.appendChild(this.cards[i]);
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
    }
    private clearCards() {
        for (let card of this.cards) {
            this.wrapperDiv.removeChild(card);
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
        //this.canvas.width = 500 * this.settings.size * scale;
        //this.canvas.height = 130 * this.settings.size * scale;
        this.canvas.style.left = `${ this.settings.position.x  * scale}px`;
        this.canvas.style.top = `${ this.settings.position.y  * scale}px`;
        this.game.setNewScale(scale);
    }

    //TEMP
    public addBuff(art: number, duration: number, player: number) {
        this.game.addBuff(art, duration, player);
    }
}

function buildCard(character: CharacterCard) {
    let card = document.createElement('div');
    let stats = document.createElement('div');
    stats.className = 'character-card-stats';
    card.appendChild(stats);
    // let img = new Image();
    // img.onload = () => {
        // card.insertBefore(img, stats);
    // }
    // img.src = artURLs[character.art];
    // img.alt = character.className;

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
                <div class="amount-int">${ character.rarity } </div>
            </div>
        </div>
    </div>`;
    card.className = 'character-card';
    return card;
}

const artURLs = [
    "images/characters/stickFigureFighters/1SculleryMaid.png",
    "images/characters/stickFigureFighters/3Barkeep.png",				
    "images/characters/stickFigureFighters/4Aristocrat.png",	
    "images/characters/stickFigureFighters/5Minstrel.png",
    "images/characters/stickFigureFighters/6Mage.png",
    "images/characters/stickFigureFighters/7Rogue.png",	
    "images/characters/stickFigureFighters/10Warpriest.png",		
    "images/characters/stickFigureFighters/12Warlock.png",	
    "images/characters/stickFigureFighters/14Swashbuckler.png",
    "images/characters/stickFigureFighters/15Dragon.png",
    "images/characters/stickFigureFighters/2Farmer.png",
    "images/characters/stickFigureFighters/8Gladiator.png",		
    "images/characters/stickFigureFighters/9Barbarian.png",	
    "images/characters/stickFigureFighters/11Werewolf.png",
    "images/characters/stickFigureFighters/13Paladin.png",
    "images/characters/stickFigureFighters/16Phoenix.png",
    "images/characters/stickFigureFighters/17Lich.png",
    "images/characters/stickFigureFighters/18Angel.png"
];
const buffArt = [
    "images/icons/buff1.png",
    "images/icons/buff2.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
    "images/icons/buff3.png",
];


function healthBarSVG(amount: StatBarAmount) {
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
        <rect width="${ amount.amount * amount.factor }%" height="100%" mask="url(#healthBarCutout)" onLoad:(console.log('load rect'))/>
    </svg>`;
}
