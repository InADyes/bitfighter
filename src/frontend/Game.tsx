import * as React from 'react';

import { State } from './interfaces';
import InfoCard from './InfoCard';
import Fight from './Fight';
import ChoiceCards from './ChoiceCards';

export class ReactRoot extends React.Component {
    public state: State;

    constructor(props: State) {
        super(props);
        this.state = props;
    }
    render() {
        return <div id="bitFighter">
            {this.state.characterChoices ? ChoiceCards(this.state.characterChoices) : ''}
            {this.state.timer ? CountDown(this.state.timer) : ''} 
            <div id="fight">{Fight(this.state.combatants)}</div>
            <div id="hoverCards">{this.state.hoverCards.map(c => InfoCard(c))}</div>
        </div>;
    }
}

function CountDown(time: number) {
    return <div id="coutdown">{time}</div>
}
