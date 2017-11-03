import * as React from 'react';

import {
    CharacterCard,
    CharacterListItem,
    FrontendCharacter,
    QueueItem,
    FrontEndSettings,
    ReelMessage
} from '../shared/interfaces/backToFrontMessage';
import { GraphicsEvent } from '../shared/interfaces/graphicsEvents';
import { assertNever } from '../shared/utility';

import InfoCard from './InfoCard';
import BitFight from './BitFight';
import ChoiceCards from './ChoiceCards';
import BitBoss from './BitBoss';
import CountDown from './CountDown';
import { State } from './interfaces';

// interface Props {
//     state: State;
//     choice: (character: number) => void;
// }

export class ReactRoot extends React.Component {
    public props: State;

    render() {
        if (this.props.settings === null)
            return null;

        return <div id="bitFighter">
            <ChoiceCards {...this.props.characterChoices}
                />
            <CountDown endTime={this.props.countDownTo} />
            <BitFight
                combatants={this.props.fight.characters}
                position={this.props.settings.bitFighterPosition}
                reel={this.props.fight.reel}
                />
            {/* <BitBoss
                boss={this.state.combatants[0]}
                position={this.state.settings.bitBossPosition}
                /> */}
            </div>;
    }
}
