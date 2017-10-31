import * as React from 'react';

import { rarityInfo } from '../shared/globals/rarity';
import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';

export default function InfoCard(
    props: {
        card: CharacterCard;
        onClick?: () => void;
        noSprite?: boolean;
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
            {props.noSprite ? undefined : <div className="image" style={{backgroundImage: `url('${ props.card.art }')`}}>
                {props.card.bitBossCheerMote ? <div className="cheermoteBadge">
                    <img src="https://s3.amazonaws.com/operaevent-gather/tier_10000.gif" />
                    <p>BitBoss<br/>Cheermote<br/>Exclusive</p>
                    </div> : undefined}
                <div className="hoverWrap">
                    <div className="flavorText">{props.card.flavorText}</div>
                    </div>
                </div>}
            <div className="left">
                <div className="skill">
                    <h4 className={props.card.rarity}>{props.card.buffName}</h4>
                    <p>
                        <img src={props.card.buffArt}/>
                        {props.card.skillText}
                        </p>
                    <div className="clear"></div>
                    </div>
                <div className="rarity">
                    <h4 className={props.card.rarity}>{props.card.rarity}</h4>
                    </div>
                </div>
            <div className="stats">
                <table><tbody>
                    <tr>
                        <td>Health</td>
                        <td colSpan={2}>{props.card.baseHealth}</td>
                        </tr>
                    <tr className="bonusHealth">
                        <td>Bonus</td>
                        <td colSpan={2}>{props.card.bonusHealth}</td>
                        </tr>
                    {Object.keys(props.card.stats).map((k, i) => (
                        <Stat name={k} value={props.card.stats[k]} key={i}/>
                    ))}
                    <tr>
                        <td>Level</td>
                        <td colSpan={2}>{props.card.level}</td>
                        </tr>
                    </tbody></table>
                </div>
            </div>
        </div>;
}

function Stat(props: {name: string; value: number}) {
    return <tr>
        <td>{props.name}</td>
        <td className="bar">
            <div
                className="innerBar"
                style={{width: `${props.value * 10}%`}}
                >
                </div>
            </td>
        </tr>
}
