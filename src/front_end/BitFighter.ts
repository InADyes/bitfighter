import { characters,
    buffURLs as buffURLsNoShim,
    artURLs as artURLsNoShim,
    atkURLs as atkURLsNoShim
} from '../shared/characterPicker';
import { GameState } from './gamestate/Gamestate';
import { BackToFrontMessage } from '../shared/interfaces/backToFrontMessage';
import { buildCard, updateStatusCards, CardChoices } from './CardChoices';
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
    private readonly artURLs = artURLsNoShim.map(url => this.settings.assetsShim + url);
    private readonly iconURLs = buffURLsNoShim.map(url => this.settings.assetsShim + url);
    private readonly atkURLs = atkURLsNoShim.map(url => this.settings.assetsShim + url);
    private resizeTimeout: number | null = null;
    private readonly queue = new Queue(
        (time) => this.game.startTimer(time)
    );

    constructor(
        private readonly wrapperDiv: HTMLDivElement,
        private settings: Settings,
        // todo: find out what gameslug is for
        private readonly emitGameEvent: (gameSlug: string, message: FrontToBackMessage) => void
    ) {
        this.game = new GameState(
            'arena',
            this.artURLs,
            this.iconURLs,
            this.atkURLs,
            chars => updateStatusCards(chars, this.artURLs)
        );
        this.updateSettings(settings);
        this.cardChoices = new CardChoices(
            <HTMLDivElement>document.getElementById('charSelect'),
            this.artURLs,
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
            this.game.newMessage(data.newReel);
        if (data.characterChoices)
            this.cardChoices.displayCards(data.characterChoices.map(c => buildCard(c, this.artURLs)));
        if (data.queue)
            this.queue.handleNewQueue({queue: data.queue, timer: data.timer});
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
            const scale = this.wrapperDiv.offsetWidth / 500;
            console.log("width:", this.wrapperDiv.offsetWidth);
            //this.wrapperDiv.style.fontSize = 12 * scale + 'px';
            this.game.setNewScale(scale);
        }, 100)
    }
}