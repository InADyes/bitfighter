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
                {props.side === 'right'
                    ? [<Char art={c.art} className={c.className} />, <HpBar currentHitPoints={c.currentHitPoints} maxHitPoints={c.maxHitPoints} name={c.name} />]
                    : [<HpBar currentHitPoints={c.currentHitPoints} maxHitPoints={c.maxHitPoints} name={c.name} />, <Char art={c.art} className={c.className} />]}
                <div className="cardWrap">
                    <InfoCard card={c.card} noSprite={true}/>
                </div>
            </div>
}

function Char(
    props: {
        art: string,
        className: string
    }
) {
    return (
        <div className="charImages">
            <img src={props.art} alt={props.className}/>
            <div className="buffs"></div>
        </div>
    );
}

function HpBar(
    props: {
        currentHitPoints: number,
        maxHitPoints: number,
        name: string
    }
) {
    return (
        <div className="hpWrapper">
            <div className="hp">{`${props.currentHitPoints}/${props.maxHitPoints}`}</div>
            <div className="redBar"></div>
            <div className="yellowBar"></div>
            <div className="greenBar"></div>
            <div className="name">{props.name}</div>
        </div>
    );
}