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

    return <div id="mini-boss-wrapper" className="main tl" style={style}>
        <div className="bar-wrapper">
            <div className="bar" style={{width: '60.6667%'}}></div>
            <div className="damage no-transition" style={{width: '0px', right: '39.3333%'}}></div>
            </div>
        <div className="row">
            <div className="col icon">
                <img className="profile" src={ b.profileImageURL } alt="avatar"/></div>
            <div className="col info">
                <div className="info-row">
                    <div className="names boss data-outline" >{ b.name }</div>
                    <div className="character data-outline">
                        <div className="char-name" >{ b.className }</div>
                        <div className="hp" >{ b.currentHitPoints } / { b.maxHitPoints }</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
}