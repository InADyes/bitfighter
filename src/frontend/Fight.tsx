import * as React from 'react';

import { FrontendCharacter, FrontEndSettings } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

export default function Fight(
    props: {
        combatants: FrontendCharacter[];
        settings: FrontEndSettings;
    }
) {
    const style = {
        left: `${ props.settings.position.x }%`,
        top: `${ props.settings.position.y }%`
    }

    return <div id="fight" style={style}> {props.combatants.map((c, i) => 
        <div className="combatant" key={i}>
            <div>
                <div className="hitPonts">{`${c.currentHitPoints}/${c.maxHitPoints}`}</div>
                <div className="name">{c.name}</div>
            </div>
            <img src={c.art} alt={c.className}/>
            <div className="cardWrap">
                <InfoCard card={c.card} noSprite={true}/>
            </div>
        </div>
    )}</div>;
}
