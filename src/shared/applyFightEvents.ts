import * as FightEvents from '../shared/fightEvents';
import { Status } from '../shared/Status';
import { otherCharacter } from '../shared/utility';
import { buildStats } from '../shared/characterPicker';

/*
    does not delete characters
*/
export function applyFightEvents(
    status: Status[],
    ...reel: FightEvents.Event[]
) {
    for (let event of reel) {
        switch (event.type) {
            case FightEvents.EventType.damage:
                status[event.character].hitPoints -= (<FightEvents.HealingEvent>event).amount;
                break;
            case FightEvents.EventType.healing:
                status[event.character].hitPoints += (<FightEvents.HealingEvent>event).amount;
                break;
            case FightEvents.EventType.crit:
                const debuff = (<FightEvents.CritEvent>event).debuff;
                if (debuff) {
                    status[event.character].addEffect(
                        event.time + debuff.duration,
                        debuff
                    );
                }
                const buff = (<FightEvents.CritEvent>event).buff;
                if (buff) {
                    status[otherCharacter(event.character)].addEffect(
                        event.time + buff.duration,
                        buff
                    );
                }
                break;
            case FightEvents.EventType.levelUp:
                const c = status[event.character];
                c.level++;
                c.stats = buildStats(c.character, c.donation, c.level);
                break;
            default:
                break;
        }
    };
}
