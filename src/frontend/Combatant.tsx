import * as React from 'react';

import { FrontendCharacter } from '../shared/interfaces/backToFrontMessage';
import { GraphicsEvent } from '../shared/interfaces/graphicsEvents';

import InfoCard from './InfoCard';

interface Props {
    combatant: FrontendCharacter,
    direction: 'left' | 'right',
    reel: GraphicsEvent[]
}

interface State {
    combatant: FrontendCharacter
}

export default class Combatant extends React.Component {
    public props: Props;
    public state: State;

    constructor(props: Props) {
        super(props);
        this.state = {combatant: props.combatant};
    }

    render() {
        const c = this.state.combatant;
        return (
            <div className="combatant">
                    {this.props.direction === 'left'
                        ? <Char art={c.art} className={c.className} direction={this.props.direction} />
                        : <HpBar currentHitPoints={c.currentHitPoints} maxHitPoints={c.maxHitPoints} name={c.name} />}
                    {this.props.direction === 'left'
                        ? <HpBar currentHitPoints={c.currentHitPoints} maxHitPoints={c.maxHitPoints} name={c.name} />
                        : <Char art={c.art} className={c.className} direction={this.props.direction}/>}
                    <div className="cardWrap">
                        <InfoCard card={c.card} noSprite={true}/>
                        </div>
                </div>
        )
    }
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