import * as React from 'react';

import { FrontendCharacter, FrontEndSettings } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

export default function BitBoss(
    props: {
        boss: FrontendCharacter;
        position: {
            x: number;
            y: number;
            scale: number;
        }
    }
) {
    const b = props.boss;
    const style = {
        left: `${ props.position.x }%`,
        top: `${ props.position.y }%`,
        height: `${ props.position.scale * 10 }vw`,
        width: `${ props.position.scale * 50 }vw`
    }

    return <div id="bitBoss" style={style}>
        </div>;
}