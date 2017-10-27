import { GameState } from './gamestate/Gamestate';
import { BackToFrontMessage, FrontendCharacter } from '../shared/interfaces/backToFrontMessage';
import { buildCard, updateCombatantCards, CardChoices } from './CardChoices';
import {
    CharacterChoice,
    FrontToBackMessage
} from '../shared/interfaces/frontToBackMessage';
import { FrontEndSettings as Settings } from './settings';
import { Queue } from './Queue';
import { flip, receiveCharList, bossMessageTooManyChanges } from './globalDependencies';

export class BitFighter {
    private readonly game: GameState;
    private canvas = document.getElementById('arena');
    private cardChoices: CardChoices;
    private resizeTimeout: number | null = null;
    private readonly queue = new Queue(
        <HTMLDivElement>document.getElementById('mini-boss-wrapper'),
        //(time) => this.game.startTimer(time)
    );

    constructor(
        private readonly wrapperDiv: HTMLDivElement,
        private settings: Settings,
        // todo: find out what gameslug is for
        private readonly emitGameEvent: (gameSlug: string, message: FrontToBackMessage) => void
    ) {
        this.game = new GameState(
            'arena',
            chars => updateCombatantCards(chars)
        );
        this.updateSettings(settings);
        this.cardChoices = new CardChoices(
            <HTMLDivElement>document.getElementById('charSelect'),
            (msg) => this.emitGameEvent('bitFighter', msg),
            this.settings.cardsTimeout
        );
        window.addEventListener('resize', () => {
            this.updateScale();
        });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden === false)
                this.emitGameEvent('bitFighter', {requestReel: true});
            // maybe should pause stuff here
        });
        setTimeout(() => {
            this.emitGameEvent('bitFighter', {requestReel: true});
        }, 1000);
    }

    public receivedViewerGameState(data: BackToFrontMessage) {
        if (data.newReel)
            this.game.newMessage(data.newReel, data.timer ? 1 : 0);
        if (data.characterChoices)
            this.cardChoices.displayCards(data.characterChoices.map(c => buildCard(c)));
        if (data.queue)
            this.queue.handleNewQueue(data.queue);
        if (data.timer)
            this.queue.handleNewTimer(data.timer);
        if (data.updateBossMessage)
            this.game.updateBossMessage(data.updateBossMessage.championIndex, data.updateBossMessage.bossMessage);
        if (data.updateBossEmoticonURL)
            this.game.updateEmote(data.updateBossEmoticonURL.championIndex, data.updateBossEmoticonURL.bossEmoticonURL);
        if (data.characterList) {
            this.updateScale();
            receiveCharList(data.characterList.map(c => {
                c.classArtURL = this.settings.assetsShim + c.classArtURL;
                return c;
            }));
        }
        if (data.bossMessageChangeFailed)
            bossMessageTooManyChanges();
    }

    public updateSettings(settings: Settings) {
        this.settings = settings;
        this.updateScale();
    }

    private updateScale() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }
        this.resizeTimeout = window.setTimeout(() => {
            this.resizeTimeout = null;
            console.log('WIDTH: ', this.wrapperDiv.offsetWidth);
            const scale = this.wrapperDiv.offsetWidth / 500;
            this.game.setNewScale(scale);
        }, 100)
    }

    public updateAlignment(alignTo: 'left' | 'right' | 'center') {
        console.log("ALIGN:", alignTo);
        this.game.setAlign(alignTo);
    }
}