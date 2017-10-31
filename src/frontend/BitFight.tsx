import * as React from 'react';

import { FrontendCharacter, FrontEndSettings } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';
import BitBoss from './BitBoss';
import Combatant from './Combatant';

export default function BitFight(
    props: {
        combatants: FrontendCharacter[];
        settings: FrontEndSettings;
    }
) {
    const style = {
        left: `${ props.settings.bitFighterPosition.x }%`,
        top: `${ props.settings.bitFighterPosition.y }%`,
        height: `${ props.settings.bitFighterPosition.scale * 5 }vw`,
        width: `${ props.settings.bitFighterPosition.scale * 30 }vw`
    }

    return <div id="combatantsWrapper" style={style}>
        {props.combatants.map((c, i) => (
            <Combatant combatant={c} key={i} />
        ))}
        </div>;
}
