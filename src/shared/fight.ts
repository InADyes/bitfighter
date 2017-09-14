import * as FightReel from './fightReel';
import { Status } from './statusTypes';
import { Combatant } from './Combatant';

export function buildFightReel(original: Status[]) {
    let combatants: Status[] = [];
    Object.assign(combatants, original); // duplicates parameters todo: this isn't working??

    let everyoneAlive = true;
    let reel: FightReel.Event[] = [];
    let c = combatants.map((combatant) => new Combatant(
        combatant,
        caller => {
            reel.push(new FightReel.DeathEvent(
                caller.time,
                c.indexOf(caller)
            ));
            everyoneAlive = false;
        },
        (caller, damage, accuracy, crit) => {
            let opponents = c.filter(c => c != caller);
            opponents[0].takeHit(damage, accuracy, crit);
        },
        caller => {
            reel.push(new FightReel.DodgeEvent(
                caller.time,
                c.indexOf(caller)
            ));
        },
        (caller, damage) => {
            reel.push(new FightReel.DamageEvent(
                caller.time,
                c.indexOf(caller),
                damage
            ));
        },
        (caller, healing) => {
            reel.push(new FightReel.HealingEvent(
                caller.time,
                c.indexOf(caller),
                healing
            ));
        },
        (caller, type) => {
            reel.push(new FightReel.CritEvent(
                caller.time,
                c.indexOf(caller),
                type
            ));
        }
    ));

    if (combatants.length < 2) {
        console.error('not enough combatants to fight');
        return { combatants: c.map(c => c.status), reel};
    }

    while (everyoneAlive) {
        if (c[0].time <= c[1].time)
            c[0].attack();
        else
            c[1].attack();
    }

    return { combatants: c.filter(c => c.isDead() == false).map(c => c.status), reel }
}
