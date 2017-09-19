import * as FightReel from './fightReel';
import { Combatant } from './Combatant';
import { Status } from '../shared/Status';
import { applyFightReel } from './applyFightReel';

export function buildFightReel(stats: Status[]) {
    let everyoneAlive = true;
    const reel: FightReel.Event[] = [];

    const newStats = stats.map(s => new Status(
            s.id, //getto deep clone
            s.name,
            s.character,
            s.donation,
            s.hitPoints,
            s.level,
            s.baseStats
    ));

    const combatants = newStats.map((s, index) => new Combatant(
        //Object.assign({}, s), //pass as copy // why wasn't this working??
        s,
        index,
        event => {
            applyFightReel(newStats, event);
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

    return { combatants: combatants.filter(c => c.isDead() == false).map(c => c.status), reel }
}
