import * as React from 'react';

import { State } from './interfaces';
import {
    CharacterCard,
    CharacterListItem,
    FrontendCharacter,
    QueueItem
} from '../shared/interfaces/backToFrontMessage';

export class ReactRoot extends React.Component {
    public state: State;

    constructor(props: State) {
        super(props);
        this.state = props;
    }
    render() {
        return <div>
            {this.state.timer ? CountDown(this.state.timer) : ''} 
            <div id="fight">{Fight(this.state.combatants)}</div>
        </div>;
    }
}

function Fight(combatants: FrontendCharacter[]) {
    return combatants.map((c, i) => 
        <div className="combatant" key={ i }>{ c.name }</div>
    );
}

function CountDown(time: number) {
    return <div id="coutdown">{ time }</div>
}
