import { GraphicsEvent } from '../shared/interfaces/graphicsEvents';
import * as React from 'react';

import { FrontendCharacter, FrontEndSettings } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';
import BitBoss from './BitBoss';
import Combatant from './Combatant';

export default function BitFight(
    props: {
        combatants: FrontendCharacter[];
        position: {
            x: number;
            y: number;
            scale: number;
        };
        reel: GraphicsEvent[];
    }
) {
    const style = {
        left: `${ props.position.x }%`,
        top: `${ props.position.y }%`,
        height: `${ props.position.scale * 5 }vw`,
        width: `${ props.position.scale * 30 }vw`
    }

    return <div id="combatantsWrapper" style={style}>
        {props.combatants.map((c, i) => (
            <Combatant
                combatant={c}
                key={i}
                direction={i < 1 ? 'right' : 'left'}
                reel={props.reel}
                />
        ))}
        </div>;
}
