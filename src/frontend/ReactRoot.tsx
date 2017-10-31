import * as React from 'react';

import { State } from './interfaces';
import InfoCard from './InfoCard';
import BitFight from './BitFight';
import ChoiceCards from './ChoiceCards';
import BitBoss from './BitBoss';

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
                : undefined}
            {time > -100 ? <CountDown time={time} /> : undefined} 
            <BitFight combatants={this.props.combatants} settings={this.props.settings}/>
            <BitBoss boss={this.props.combatants[0]} position={this.props.settings.bitBossPosition}/>
            </div>;
    }
}

function CountDown(props: {time: number}) {
    return <div id="coutdown">
        {Math.round(props.time / 1000)}
        </div>
}
