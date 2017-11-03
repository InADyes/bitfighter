import * as React from 'react';

import { FrontendCharacter } from '../shared/interfaces/backToFrontMessage';
import { GraphicsEvent } from '../shared/interfaces/graphicsEvents';

import InfoCard from './InfoCard';

interface Props {
    combatant: FrontendCharacter,
    direction: 'left' | 'right',
    reel: GraphicsEvent[]
}

export default class Combatant extends React.Component {
    public props: Props;
    public state: FrontendCharacter;
    private timoutID: number | null = null;
    private nextEventIndex: number = 0;

    constructor(props: Props) {
        super(props);

        this.state = props.combatant;
        this.timoutNextEvent();
    }

    private timoutNextEvent(){
        const event = this.props.reel[this.nextEventIndex];

        if (event === undefined)
            return;
        
        this.nextEventIndex++;

        
        this.timoutID =  window.setTimeout(
            () => this.applyEvent(event),
            event.time - performance.now()
        );
    }

    private applyEvent(event: GraphicsEvent) {
        this.setState((): Partial<FrontendCharacter> => (
                Combatant.buildChanges(event)
        ));
    }

    componentWillReceiveProps(props: Props) {
        this.setState((): FrontendCharacter => (
            props.combatant
        ));
    
        this.nextEventIndex = 0;
        if (this.timoutID)
            window.clearTimeout(this.timoutID);
        this.timoutNextEvent();
    }

    // BUG: should this be returing a partial or 
    private static buildChanges(
        ...events: GraphicsEvent[]
    ): Partial<FrontendCharacter> {
        const character: Partial<FrontendCharacter> = {};

        for (let e of events) {
            switch(e.type) {
                case 'health':
                    character.currentHitPoints = e.health;
                    break;
                case 'attack':
                    break;
                case 'text':
                    break;
                case 'buff':
                    break;
                case 'clear':
                    break;
                
            }
        }

        return character;
    }

    render() {
        const c = this.state;
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
        );
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
