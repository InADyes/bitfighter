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
    private state: State = {
        countDownTo: 0,
        fight: {
            characters: [],
            reel: []
        },
        queue: [],
        characterList: [],
        settings: null,
        characterChoices: {
            cards: [],
            endTime: -1,
            callBack: (choice) => {
                this.emitGameEvent('bitFighter', {characterChoice: choice});
                this.state.characterChoices.endTime = -1;
                this.render();
            }
        },
        view: 'bitBoss'
    };
    private reactRoot = new ReactRoot(this.state);
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
            this.state.settings = m.settings;
        if (m.newReel)
            this.state.fight = m.newReel
        if (m.characterChoices && this.state.settings) {
            this.state.characterChoices.cards = m.characterChoices
            this.state.characterChoices.endTime = performance.now() +  this.state.settings.cardsTimeout;
        }
        if (m.queue)
            this.state.queue = m.queue;
        if (m.timer)
            this.state.countDownTo = window.performance.now() + m.timer;
        if (m.updateBossMessage
            && this.state.fight.characters[m.updateBossMessage.championIndex]
        ) {
            this.state.fight.characters[m.updateBossMessage.championIndex].bossMessage = m.updateBossMessage.bossMessage;
        }
        if (
            m.updateBossEmoticonURL
            && this.state.fight.characters[m.updateBossEmoticonURL.championIndex]
        ) {
            this.state.fight.characters[m.updateBossEmoticonURL.championIndex].bossEmoticonURL = m.updateBossEmoticonURL.bossEmoticonURL;
        }
        if (m.characterList)
            this.state.characterList = m.characterList;
        if (m.bossMessageChangeFailed)
            window.alert('boss message name change failed');

        this.render();
    }

    private render() {
        ReactDOM.render(
            <ReactRoot {...this.state} />,
            this.container 
        );
    }

    // private newReel(reel: ReelMessage) {
    //     if (reel.patch && reel.patch > this.reelStartTime) {
    //         console.log('would do patching here');
    //     } else {
    //         this.startReel(reel);
    //     }
    // }

    // private startReel(reel: ReelMessage) {
    //     this.state.combatants = reel.characters;
    //     this.reel = reel.reel;
    //     this.reelStartTime = window.performance.now();

    //     // if this is a patch backdate the time and play the first event immediatly 
    //     if (reel.patch && this.reel[0]) {
    //         this.reelStartTime -= this.reel[0].time;
    //         this.applyNextEvent();
    //     }
    //     this.playEvents();
    // }

    // private playEvents() {
    //     if (this.reelTimout)
    //         window.clearTimeout(this.reelTimout);
    //     if (this.reel[0]) {
    //         this.reelTimout = window.setTimeout(
    //             () => {
    //                 this.reelTimout = null;
    //                 const time = this.reel[0].time;
    //                 do {
    //                     this.applyNextEvent();
    //                 } while (this.reel[0] && this.reel[0].time === time);
    //                 this.render();
    //                 this.playEvents();
    //             },
    //             this.reelStartTime + this.reel[0].time - window.performance.now()
    //         );
    //     }
    // }

    // private applyNextEvent() {
    //     const event = this.reel.shift();

    //     if (event === undefined) {
    //         console.error('no next event');
    //         return;
    //     }

    //     switch (event.type) {
    //         case 'health':
    //             this.state.combatants[event.character].currentHitPoints = event.health;
    //             break;
    //         case 'attack':
    //             console.log(`character ${ event.character} attacks`);
    //             break;
    //         case 'clear':
    //             this.state.combatants.splice(event.character, 1);
    //             break;
    //         case 'text':
    //             console.log('text out: ', event.text);
    //             break;
    //         case 'buff':
    //             console.log('buff: ', event.character);
    //             break;
    //         default:
    //             assertNever(event);
    //     }
    // }
}
