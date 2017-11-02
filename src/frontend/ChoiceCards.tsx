import * as React from 'react';

import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

export default function ChoiceCards(
    props: {
        cards: CharacterCard[];
        endTime: number;
        callBack: (character: number) => void;
    }
) {
    const time = window.performance.now();

    if (props.endTime < time)
        return null;

    return (
    <div>
        <div id="choiceCards">
            {props.cards.map((c, i) =>
                <InfoCard
                    card={c}
                    onClick={() => props.callBack(i)}
                    key={i}
                    />
            )}
        </div>
        <div className="charSelectTimerWrapper">
            <div className="charSelectTimerFlipper">
                <div className="charSelectTimer">
                    60
                </div>
                <div className="charSelectTimerBack">
                    <img src="../src/images/icons/bitboss.png" id='bitbossEmoji'></img>
                </div>
            </div>
        </div>
    </div>
    );
}

