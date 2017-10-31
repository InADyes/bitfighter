import * as React from 'react';

import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

export default function ChoiceCards(props: {
    choices: {
        card: CharacterCard;
        onClick: () => void;
    }[]
}) {
    return <div id="choiceCards">
        {props.choices.map((c, i) =>
            <InfoCard card={c.card} onClick={c.onClick} key={i} />
        )}
    </div>
}
