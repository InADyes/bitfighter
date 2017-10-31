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

    return <div id="combatantsWrapper" style={style}>
        <div id="bitFighter">
            {props.combatants.map((c, i) => (
                <Combatant combatant={c} key={i} />
            ))}
            </div>
        <BitBoss boss={props.combatants[0]}/>
        </div>;
}

function Combatant(
    props: {combatant: FrontendCharacter}
) {
    const c = props.combatant;

    return <div className="combatant">
        <div>
            <div className="hitPonts">{`${c.currentHitPoints}/${c.maxHitPoints}`}</div>
            <div className="name">{c.name}</div>
            </div>
        <img src={c.art} alt={c.className}/>
        <div className="cardWrap">
            <InfoCard card={c.card} noSprite={true}/>
            </div>
        </div>
}

function BitBoss(
    props: {boss: FrontendCharacter}
) {
    const b = props.boss;

    return null;
}
