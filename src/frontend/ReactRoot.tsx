import * as React from 'react';

import { State } from './interfaces';
import InfoCard from './InfoCard';
import Fight from './Fight';
import ChoiceCards from './ChoiceCards';

export class ReactRoot extends React.Component {
    public props: State;

    render() {
        if (this.props.settings === null)
            return null;

        const time = this.props.timerEndTime - performance.now();

        return <div id="bitFighter">
            {this.props.characterChoices ?
                <ChoiceCards
                    choices={this.props.characterChoices}
                    />
                : ''}
            {time > -100 ? <CountDown time={time} /> : ''} 
            <Fight combatants={this.props.combatants} settings={this.props.settings}/>
        </div>;
    }
}

function CountDown(props: {time: number}) {
    return <div id="coutdown">{Math.round(props.time / 1000)}</div>
}
