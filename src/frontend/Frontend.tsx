import * as ReactDOM from 'react-dom';

import {
    BackToFrontMessage,
    FrontEndSettings,
    ReelMessage
} from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { GraphicsEvent } from '../shared/interfaces/graphicsEvents';
import { State } from './interfaces';
import { ReactRoot } from './Game';

export class Frontend {
    private reelTimout: number | null = null;
    private reel: GraphicsEvent[] = [];
    private state: State = {
        hoverCards: [],
        combatants: [],
        queue: [],
        characterList: []
    };
    private reactRoot = new ReactRoot(this.state);
    private settings: FrontEndSettings | null = null;
    constructor(
        private container: HTMLDivElement,
        private readonly emitGameEvent: (gameSlug: string, message: FrontToBackMessage) => void
    ) {
        this.emitGameEvent('bitFigher', {
            requestReel: true
        })
    }
    public receivedViewerGameState(message: BackToFrontMessage) {
        const m = message;

        if (m.newReel)
            this.newReel(m.newReel);
        if (m.characterChoices)
            this.state.characterChoices = m.characterChoices;
        if (m.queue)
            this.state.queue = m.queue;
        if (m.timer)
            this.state.timer = m.timer;
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
        if (m.settings)
            this.settings = m.settings;

        ReactDOM.render(
            this.reactRoot.render(),
            this.container 
        );
    }
    private newReel(newReel: ReelMessage) {
        this.state.combatants = newReel.characters
        console.log('new reel:', newReel);
    }
}
