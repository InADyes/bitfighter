import * as React from 'react';

import { FrontendCharacter } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

export default function Combatant(
    props: {
        combatant: FrontendCharacter,
        side: 'left' | 'right',
        animateToggle: boolean
    }
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
