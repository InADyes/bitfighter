import * as FightReel from './fightReel';
//import * as Status from './Status';
import { Combatant } from './Combatant';

import { Status } from '../shared/Status';

export function buildFightReel(stats: Status[]) {
    let everyoneAlive = true;
    const reel: FightReel.Event[] = [];
    const combatants = stats.map((s, index) => new Combatant(
        //Object.assign({}, s), //pass as copy // why wasn't this working??
        new Status(
            s.id,
            s.name,
            s.character,
            s.donation,
            s.hitPoints,    
            s.level,
            s.baseStats
        ),
        index,
        event => {
            reel.push(event);
            if (event.type == FightReel.EventType.death)
                everyoneAlive = false;
        },
        (caller, damage, accuracy, crit, debuff) => {
            let opponents = combatants.filter(c => c != caller);
            opponents[0].takeHit(damage, accuracy, crit, debuff);
        }
    ));

    if (combatants.length < 2) {
        console.error('not enough combatants to fight');
        return { combatants: combatants.map(c => c.status), reel};
    }

    while (everyoneAlive) {
        if (combatants[0].time <= combatants[1].time)
            combatants[0].attack();
        else
            combatants[1].attack();
    }
    
    combatants.forEach(c => c.status.clearBuffs());

    return { combatants: combatants.filter(c => c.isDead() == false).map(c => c.status), reel }
}
