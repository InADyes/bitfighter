import * as React from 'react';

import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

export default function ChoiceCards(choices: CharacterCard[]) {
    return <div id="choiceCards">
        {choices.map((c, i) => InfoCard(c, i))}
    </div>
}