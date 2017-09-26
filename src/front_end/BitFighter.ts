import { GameState } from './gamestate/Gamestate';
import { BackToFrontMessage, FrontToBackMessage, CharacterChoice, FrontEndSettings as Settings } from '../shared/frontEndMessage';

export class BitFighter {
    private readonly game: GameState;
    private canvas: HTMLCanvasElement = document.createElement('canvas');
    private cards: HTMLButtonElement[] = [];

    constructor(
        private readonly wrapperDiv: HTMLDivElement,
        settings: Settings,
        private readonly emitGameEvent: (gameSlug: any, message: FrontToBackMessage) => void
    ) {
        // build arena
        this.canvas.id = 'arena';
        this.canvas.style.position = 'absolute';
        this.updateSettings(settings);
        this.wrapperDiv.appendChild(this.canvas);
        this.game = new GameState('arena');

    }
    public recievedViewerGameState(data: BackToFrontMessage) {
        if (data.newReel) {
            this.game.newMessage(data.newReel.reel, data.newReel.patch);
            this.game.initPlayers(data.newReel.characters);
        }
        if (data.characterChoices) {
            for (let i = 0; i < 3; i++) {
                let button = document.createElement('button');
                button.innerText = String(i);
                button.addEventListener('click', () => {
                    this.emitGameEvent(null, {
                        characterChoice: {
                            choice: i
                    }});
                    this.clearCards();
                });
                this.wrapperDiv.appendChild(button);
                this.cards.push(button);
            }
        }
    }
    private clearCards() {
        for (let card of this.cards) {
            this.wrapperDiv.removeChild(card);
        }
        this.cards = [];
    }
    private updateSettings(settings: Settings) {
        this.canvas.width = 500 * settings.size;
        this.canvas.height = 130 * settings.size;
        this.canvas.style.left = `${ settings.position.x }px`;
        this.canvas.style.top = `${ settings.position.y }px`;
        // todo: update gamestate scaler here
    }
}
