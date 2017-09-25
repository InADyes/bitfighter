import { GameState } from './gamestate/Gamestate';
import {    BackToFrontMessage, FrontToBackMessage, CharacterChoice, FrontEndSettings as Settings } from '../shared/frontEndMessage';

export class BitFighter {
    private readonly game: GameState;
    private canvas: HTMLCanvasElement = document.createElement('canvas');

    constructor(
        wrapperDiv: HTMLDivElement,
        settings: Settings,
        private readonly emitGameEvent: (gameSlug: any, message: FrontToBackMessage) => void
    ) {
        // build arena
        this.canvas.id = 'arena';
        this.canvas.style.position = 'absolute';
        this.updateSettings(settings);
        wrapperDiv.appendChild(this.canvas);
        this.game = new GameState('arena');

        // build buttons
        const button0 = document.createElement('button');
        const button1 = document.createElement('button');
        const button2 = document.createElement('button');
        wrapperDiv.appendChild(button0);
        wrapperDiv.appendChild(button1);
        wrapperDiv.appendChild(button2);
        button0.innerText = '0';
        button1.innerText = '1';
        button2.innerText = '2';

        button0.addEventListener('click', () => {
            this.emitGameEvent(null, {
                characterChoice: {
                    choice: 0
            }});
        });
        button1.addEventListener('click', () => {
            this.emitGameEvent(null, {
                characterChoice: {
                    choice: 1
            }});
        });
        button2.addEventListener('click', () => {
            this.emitGameEvent(null, {
                characterChoice: {
                    choice: 2
            }});
        });

    }
    public recievedViewerGameState(data: BackToFrontMessage) {
        if (data.newReel) {
            this.game.newMessage(data.newReel.reel, data.newReel.patch);
            this.game.initPlayers(data.newReel.characters);
        }
        if (data.characterChoices) {

        }
    }
    private updateSettings(settings: Settings) {
        this.canvas.width = 500 * settings.size;
        this.canvas.height = 130 * settings.size;
        this.canvas.style.left = `${ settings.position.x }px`;
        this.canvas.style.top = `${ settings.position.y }px`;
        // todo: update gamestate scaler here
    }
}
