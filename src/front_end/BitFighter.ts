import { GameState } from './gamestate/Gamestate';
import { BackToFrontMessage, FrontToBackMessage, CharacterChoice, FrontEndSettings as Settings } from '../shared/frontEndMessage';
import { Stats } from '../shared/Status';

export class BitFighter {
    private readonly game: GameState;
    private canvas: HTMLCanvasElement = document.createElement('canvas');
    private cards: HTMLDivElement[] = [];

    constructor(
        private readonly wrapperDiv: HTMLDivElement,
        settings: Settings,
        // todo: find out what gameslug is for
        private readonly emitGameEvent: (gameSlug: string, message: FrontToBackMessage) => void,
        private timeout: number | null = null
    ) {
        // build arena
        this.canvas.id = 'arena';
        this.canvas.style.position = 'absolute';
        this.updateSettings(settings);
        this.wrapperDiv.appendChild(this.canvas);
        this.game = new GameState('arena');
        this.updateScale();
        window.addEventListener('resize', () => {
            this.updateScale();
        })
    }
    public recievedViewerGameState(data: BackToFrontMessage) {
        if (data.newReel) {
            this.game.newMessage(data.newReel.reel, data.newReel.characters, data.newReel.patch);
        }
        if (data.characterChoices) {
            const characters = data.characterChoices.characters;
            if (this.timeout) {
                this.clearCards();
            }
            this.cards = data.characterChoices.characters.map(c => buildCard(c.stats, c.className, c.art, c.level));
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
                60000 // one minute
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
    private updateSettings(settings: Settings) {
        this.canvas.width = 500 * settings.size;
        this.canvas.height = 130 * settings.size;
        this.canvas.style.left = `${ settings.position.x }px`;
        this.canvas.style.top = `${ settings.position.y }px`;
        // todo: update gamestate scaler here
    }
    updateScale() {
        const scale = this.wrapperDiv.offsetHeight / 400;
        this.wrapperDiv.style.fontSize = 12 * scale + 'px';
        // update gamestate scale here
    }
}

function buildCard(stats: Stats, className: string, art: number, level: number) {
    let card = document.createElement('div');
    let text = document.createElement('span');
    card.appendChild(text);
    
    let img = new Image();
    img.onload = () => {
        card.insertBefore(img, text);
    }
    img.src = artURLs[art];
    img.alt = className;
    text.innerHTML = `${ className }
    <br>Accuracy: ${ stats.accuracy }
    <br>Dodge: ${ stats.dodge }
    <br>Armor: ${ stats.armor }
    <br>Damage: ${ stats.attackDamage.min } - ${ stats.attackDamage.max }
    <br>Level: ${ level }
    <br>Health: ${ stats.maxHitPoints }`;
    card.className = 'character-card';
    return card;
}


const artURLs = [
    "images/characters/stickFigures/0StreetUrchin.png",
    "images/characters/stickFigures/1SculleryMaid.png",
    "images/characters/stickFigures/2Farmer.png",
    "images/characters/stickFigures/3Barkeep.png",				
    "images/characters/stickFigures/4Aristocrat.png",	
    "images/characters/stickFigures/5Minstrel.png",
    "images/characters/stickFigures/6Mage.png",
    "images/characters/stickFigures/7Rogue.png",	
    "images/characters/stickFigures/8Gladiator.png",		
    "images/characters/stickFigures/9Barbarian.png",	
    "images/characters/stickFigures/10Warpriest.png",		
    "images/characters/stickFigures/11Werewolf.png",
    "images/characters/stickFigures/12Warlock.png",	
    "images/characters/stickFigures/13Paladin.png",
    "images/characters/stickFigures/14Swashbuckler.png",
    "images/characters/stickFigures/15Dragon.png",
    "images/characters/stickFigures/16Phoenix.png",
    "images/characters/stickFigures/17Lich.png",
    "images/characters/stickFigures/18Angel.png"
];
