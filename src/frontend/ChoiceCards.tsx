import * as React from 'react';

import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

export default function ChoiceCards(props: {
    choices: {
        card: CharacterCard;
        onClick: () => void;
    }[]
}) {
    return (
    <div>
        <div id="choiceCards">
            {props.choices.map((c, i) =>
                <InfoCard card={c.card} onClick={c.onClick} key={i} />
            )}
        </div>
        <div className="charSelectTimerWrapper">
            <div className="charSelectTimerFlipper">
                <div className="charSelectTimer">
                    60
                </div>
                <div className="charSelectTimerBack">
                    bitboss icon goes here
                </div>
            </div>
        </div>
    </div>
    )
}

