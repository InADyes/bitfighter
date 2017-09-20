import * as FightEvents from './fightEvents';
import { Combatant } from './Combatant';
import { Status } from '../shared/Status';
import { applyFightEvents } from './applyFightEvents';
import { otherCharacter } from './utility';

export function buildFightEvents(stats: Status[]) {
    let everyoneAlive = true;
    const reel: FightEvents.Event[] = [];

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
            applyFightEvents(newStats, event);
            reel.push(event);
            if (event.type == FightEvents.EventType.death) {
                everyoneAlive = false;
                let levelEvent = new FightEvents.LevelUpEvent(
                    event.time,
                    otherCharacter(event.character)
                );
                applyFightEvents(newStats, levelEvent);
                reel.push(levelEvent);
            }
        },
        (caller, damage, accuracy, crit, debuff) => {
            let opponents = combatants.filter(c => c != caller);
            opponents[0].takeHit(damage, accuracy, crit, debuff);
        }
    ));

    if (combatants.length < 2) {
        console.error('not enough combatants to fight');
        return {combatants: stats, reel};
    }

    while (everyoneAlive) {
        if (combatants[0].time <= combatants[1].time)
            combatants[0].attack();
        else
            combatants[1].attack();
    }

    return { combatants: combatants.filter(c => c.isDead() == false).map(c => c.status), reel }
}
