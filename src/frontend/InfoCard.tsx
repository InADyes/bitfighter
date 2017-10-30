import * as React from 'react';

import { rarityInfo } from '../shared/globals/rarity';
import { CharacterCard as CharacterCardInfo } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';

export default function InfoCard(
    info: CharacterCardInfo,
    key?: number
) {
    let classes = 'characterCard';

    if (info.selectable === false)
        classes += ' not_selectable';
    if (info.bitBossCheerMote)
        classes += ' cheerMote';

    return <div className={classes} key={key}>
        <div className="inner">
            <h3 className={info.rarity}>{info.className}</h3>
            <div style={{backgroundImage: `url('${ info.art }')`}}></div>
            <div className="badge">
                <img src="https://s3.amazonaws.com/operaevent-gather/tier_10000.gif" />
                <p>BitBoss<br/>Cheermote<br/>Exclusive</p>
            </div>
            <div className="hoverWrap">
                <div className="flavorText">{info.flavorText}</div>
            </div>
            <div className="left">
                <div className="skill">
                    <h4 className={info.rarity}>{info.buffName}</h4>
                    <p><img src={ info.buffArt }/>{ info.skillText }</p>
                    <div className="clear"></div>
                </div>
                <div className="rarity">
                    <h4 className={info.rarity}>{info.rarity}</h4>
                </div>
            </div>
            <div className="stats">
            </div>
        </div>
    </div>;
}
