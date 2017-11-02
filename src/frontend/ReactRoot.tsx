import * as React from 'react';

import { State } from './interfaces';
import InfoCard from './InfoCard';
import BitFight from './BitFight';
import ChoiceCards from './ChoiceCards';
import BitBoss from './BitBoss';
import CountDown from './CountDown';

export class ReactRoot extends React.Component {
    public props: State;

    render() {
        if (this.props.settings === null)
            return null;

        return <div id="bitFighter">
            {this.props.characterChoices ?
                <ChoiceCards
                    choices={this.props.characterChoices}
                    />
                : undefined}
            {<CountDown time={Math.floor(this.props.countDown)} />} 
            <BitFight combatants={this.props.combatants} settings={this.props.settings}/>
            <BitBoss boss={this.props.combatants[0]} position={this.props.settings.bitBossPosition}/>
            </div>;
    }
}

// function CountDown2(props: {time: number}) {
//     return <div id="coutdown">
//         {Math.round(props.time / 1000)}
//         </div>
// }
