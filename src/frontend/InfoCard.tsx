import * as React from 'react';

import { rarityInfo } from '../shared/globals/rarity';
import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';

export default function InfoCard(
    props: {
        card: CharacterCard;
        onClick?: () => void;
    }
) {
    let classes = 'characterCard';

    if (props.card.selectable === false)
        classes += ' not_selectable';
    if (props.card.bitBossCheerMote)
        classes += ' cheermote';

    return <div className={classes} onClick={props.card.selectable ?props.onClick : undefined}>
        {props.card.selectable ? undefined : <div className="disabledwrap">
            <div className="disabled"> 
                <img src="https://s3.amazonaws.com/operaevent-gather/locked.png"/><br/>
            This card is only available when using the bitboss cheermote
            </div>
        </div>}
        <div className="inner">
            <h3 className={props.card.rarity}>{props.card.className}</h3>
            <div className="image" style={{backgroundImage: `url('${ props.card.art }')`}}>
                {props.card.bitBossCheerMote ? <div className="cheermoteBadge">
                    <img src="https://s3.amazonaws.com/operaevent-gather/tier_10000.gif" />
                    <p>BitBoss<br/>Cheermote<br/>Exclusive</p>
                </div> : undefined}
                <div className="hoverWrap">
                    <div className="flavorText">{props.card.flavorText}</div>
                </div>
            </div>
            <div className="left">
                <div className="skill">
                    <h4 className={props.card.rarity}>{props.card.buffName}</h4>
                    <p><img src={props.card.buffArt}/>{props.card.skillText}</p>
                    <div className="clear"></div>
                </div>
                <div className="rarity">
                    <h4 className={props.card.rarity}>{props.card.rarity}</h4>
                </div>
            </div>
            <div className="stats">
            </div>
        </div>
    </div>;
}
