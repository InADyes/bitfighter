import * as FightEvents from './fightEvents';
import { Combatant } from './Combatant';
import { Status } from '../shared/Status';
import { applyFightEvents } from './applyFightEvents';
import { otherCharacter  as other} from './utility';

export function buildFightEvents(stats: Status[]) {
    const reel: FightEvents.Event[] = [];

    const newStats = stats.map(s => new Status(
            s.id, //getto deep clone
            s.name,
            s.character,
            s.initialDonation,
            s.hitPoints,
            s.level,
            s.baseStats
    ));

    const combatants = newStats.map((s, index) => new Combatant(
        s,
        index,
        event => {
            applyFightEvents(newStats, event);
            reel.push(event);
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

    while (newStats.length >= 2) {
        if (combatants[0].time <= combatants[1].time)
            combatants[0].attack();
        else
            combatants[1].attack();
    }

    newStats.forEach(s => s.clearBuffs());
    //combatants.forEach(c => c.heal());

    return { combatants: newStats, reel }
}