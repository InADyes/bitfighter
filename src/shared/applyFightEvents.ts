import * as FightEvents from '../shared/fightEvents';
import { Status } from '../shared/Status';
import { otherCharacter } from '../shared/utility';
import { buildStats, levels } from '../shared/characterPicker';

// also modifies events that would take health too high or low
export function applyFightEvents(
    status: Status[],
    ...reel: FightEvents.Event[]
) {
    for (let event of reel) {
        switch (event.type) {
            case FightEvents.Types.damage:

                // modification, todo: remove
                if (status[event.character].hitPoints < (<FightEvents.Healing>event).amount)
                    (<FightEvents.Healing>event).amount = status[event.character].hitPoints
                status[event.character].hitPoints -= (<FightEvents.Healing>event).amount;
                break;
            case FightEvents.Types.healing:
                const char = status[event.character];
                const healing = <FightEvents.Healing>event;

                //modification: todo: remove
                if (char.baseStats.maxHitPoints < char.hitPoints + healing.amount)
                     healing.amount = char.baseStats.maxHitPoints - char.hitPoints;
                char.hitPoints += (<FightEvents.Healing>event).amount;
                break;
            case FightEvents.Types.crit:
                const debuff = (<FightEvents.Crit>event).debuff;
                if (debuff) {
                    status[event.character].addEffect(
                        event.time + debuff.duration,
                        debuff
                    );
                }
                const buff = (<FightEvents.Crit>event).buff;
                if (buff) {
                    status[otherCharacter(event.character)].addEffect(
                        event.time + buff.duration,
                        buff
                    );
                }
                break;
            case FightEvents.Types.death: // level up also happens here
                status.splice(event.character, 1);
                const c = status[0];
                if (levels.length > c.level) {
                    c.level++;
                    c.baseStats = buildStats(c.character, c.initialDonation, c.level);
                }
        }
    };
}
