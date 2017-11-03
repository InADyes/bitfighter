import { Packet } from '_debugger';
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
        countDownTo: -1,
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
        if (m.newReel) {
            ajustReelTimings(m.newReel.reel);
            this.state.fight = m.newReel
        }
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
}

function ajustReelTimings(reel: GraphicsEvent[]) {
    const time = window.performance.now();

    for (let event of reel) {
        event.time += time;
    }
}
