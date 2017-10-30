import * as React from 'react';

import { FrontendCharacter } from '../shared/interfaces/backToFrontMessage';

export default function Fight(combatants: FrontendCharacter[]) {
    return combatants.map((c, i) => 
        <div className="combatant" key={i}>
            <div>
                <div className="hitPonts">{`${c.currentHitPoints}/${c.maxHitPoints}`}</div>
                <div className="name">{c.name}</div>
            </div>
            <img src={c.art} alt={c.className}/>
        </div>
    );
}
