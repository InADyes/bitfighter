import * as React from 'react';

import { FrontendCharacter } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

export default function Fight(props: {combatants: FrontendCharacter[]}) {
    return <div id="fight"> {props.combatants.map((c, i) => 
        <div className="combatant" key={i}>
            <div>
                <div className="hitPonts">{`${c.currentHitPoints}/${c.maxHitPoints}`}</div>
                <div className="name">{c.name}</div>
            </div>
            <img src={c.art} alt={c.className}/>
            <InfoCard card={c.card} noSprite={true}/>
        </div>
    )}</div>;
}
