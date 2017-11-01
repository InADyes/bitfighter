import * as React from 'react';

import { FrontendCharacter } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

export default function Combatant(
    props: {
        combatant: FrontendCharacter,
        direction: 'left' | 'right',
        animateToggle: boolean
    }
) {
    const c = props.combatant;
    console.log(props.direction);
    return <div className="combatant">
                {props.direction === 'left'
                    ? <Char art={c.art} className={c.className} direction={props.direction} />
                    : <HpBar currentHitPoints={c.currentHitPoints} maxHitPoints={c.maxHitPoints} name={c.name} />}
                {props.direction === 'left'
                    ? <HpBar currentHitPoints={c.currentHitPoints} maxHitPoints={c.maxHitPoints} name={c.name} />
                    : <Char art={c.art} className={c.className} />}
                <div className="cardWrap">
                    <InfoCard card={c.card} noSprite={true}/>
                </div>
            </div>
}

function Char(
    props: {
        art: string,
        className: string,
        direction: string        
    }
) {
    return (
        <div className="charImages">
            <img src={props.art} alt={props.className} className={props.direction == 'left' ? "charImg player2" : "charImg"}/>
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