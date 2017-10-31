import * as ReactDOM from 'react-dom';
import * as React from 'react';

import {
    BackToFrontMessage,
    FrontEndSettings,
    ReelMessage
} from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { GraphicsEvent } from '../shared/interfaces/graphicsEvents';
import { State } from './interfaces';
import { ReactRoot } from './ReactRoot';
import { assertNever } from '../shared/utility';

export class Frontend {
    private reelStartTime: number = 0;
    private reelTimout: number | null = null;
    private characterChoicesTimout: number | null = null;
    private reel: GraphicsEvent[] = [];
    private state: State = {
        timerEndTime: 0,
        combatants: [],
        queue: [],
        characterList: []
    };
    private reactRoot = new ReactRoot(this.state);
    private settings: FrontEndSettings | null = null;
    constructor(
        private container: HTMLDivElement,
        private readonly emitGameEvent: (gameSlug: 'bitFighter', message: FrontToBackMessage) => void
    ) {
        this.emitGameEvent('bitFighter', {
            requestReel: true
        })
    }
    public receivedViewerGameState(message: BackToFrontMessage) {
        const m = message;

        if (m.settings)
            this.settings = m.settings;
        if (m.newReel)
            this.newReel(m.newReel);
        if (m.characterChoices && this.settings && this.characterChoicesTimout === null) {
            this.state.characterChoices = m.characterChoices.map((c, i) => ({
                card: c,
                onClick: () => {
                    if (this.characterChoicesTimout) {
                        window.clearTimeout(this.characterChoicesTimout);
                        this.characterChoicesTimout = null;
                    }
                    this.state.characterChoices = [];
                    this.render();
                    this.emitGameEvent('bitFighter', {characterChoice: i});
                } 
            }));
            this.characterChoicesTimout = window.setTimeout(
                () => {
                    this.characterChoicesTimout = null;
                    this.state.characterChoices = [];
                    this.render();
                },
                this.settings.cardsTimeout
            );
        }
        if (m.queue)
            this.state.queue = m.queue;
        if (m.timer) {
            this.state.timerEndTime = window.performance.now() + m.timer;
            for (let i = 1000; i <= m.timer; i += 1000) {
                window.setTimeout(() => {
                    this.render();
                }, i)
            }
        }
        if (
            m.updateBossMessage
            && this.state.combatants[m.updateBossMessage.championIndex]
        ) {
            this.state.combatants[m.updateBossMessage.championIndex].bossMessage = m.updateBossMessage.bossMessage;
        }
        if (
            m.updateBossEmoticonURL
            && this.state.combatants[m.updateBossEmoticonURL.championIndex]
        ) {
            this.state.combatants[m.updateBossEmoticonURL.championIndex].bossEmoticonURL = m.updateBossEmoticonURL.bossEmoticonURL;
        }
        if (m.characterList)
            this.state.characterList = m.characterList;
        if (m.bossMessageChangeFailed)
            window.alert('boss message name change failed');

        this.render();
    }

    private render() {
        const test = ReactDOM.render(
            <ReactRoot {...this.state} />,
            this.container 
        );
    }

    private newReel(reel: ReelMessage) {
        if (reel.patch && reel.patch > this.reelStartTime) {
            console.log('would do patching here');
        } else {
            this.startReel(reel);
        }
    }

    private updateTimer() {

    }

    private startReel(reel: ReelMessage) {
        this.state.combatants = reel.characters;
        this.reel = reel.reel;
        this.reelStartTime = window.performance.now();

        // if this is a patch backdate the time and play the first event immediatly 
        if (reel.patch && this.reel[0]) {
            this.reelStartTime -= this.reel[0].time;
            this.applyNextEvent();
        }
        this.playEvents();
    }

    private playEvents() {
        if (this.reelTimout)
            window.clearTimeout(this.reelTimout);
        if (this.reel[0]) {
            this.reelTimout = window.setTimeout(
                () => {
                    this.reelTimout = null;
                    const time = this.reel[0].time;
                    do {
                        this.applyNextEvent();
                    } while (this.reel[0] && this.reel[0].time === time);
                    this.render();
                    this.playEvents();
                },
                this.reel[0].time - window.performance.now() - this.reelStartTime
            );
        }
    }

    private applyNextEvent() {
        const event = this.reel.shift();

        if (event === undefined) {
            console.error('no next event');
            return;
        }

        switch (event.type) {
            case 'health':
                this.state.combatants[event.character].currentHitPoints = event.health;
                break;
            case 'attack':
                console.log(`character ${ event.character} attacks`);
                break;
            case 'clear':
                this.state.combatants.splice(event.character, 1);
                break;
            case 'text':
                console.log('text out: ', event.text);
                break;
            case 'buff':
                console.log('buff: ', event.character);
                break;
            default:
                assertNever(event);
        }
    }
}
