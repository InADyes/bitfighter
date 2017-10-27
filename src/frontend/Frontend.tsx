import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { BackToFrontMessage } from '../shared/interfaces/backToFrontMessage';

export class Frontend {
    constructor(
        private container: HTMLDivElement,
        private readonly emitGameEvent: (gameSlug: string, message: FrontToBackMessage) => void
    ) {
        ReactDOM.render(
            <h1>hello world</h1>,
            this.container 
        );
    }
    public receivedViewerGameState(data: BackToFrontMessage) {}
}
