import * as FightReel from '../shared/fightReel';
import { Status } from '../shared/help';

export function applyFightReel(
    status: Status[],
    reel: FightReel.Event[]
) {
    for (let event of reel) {
        switch (event.type) {
            case FightReel.EventType.damage:
                status[event.character].hitPoints -= (<FightReel.HealingEvent>event).amount;
                break;
            case FightReel.EventType.healing:
                status[event.character].hitPoints += (<FightReel.HealingEvent>event).amount;
                break;
            case FightReel.EventType.crit:
                status[event.character].addEffect(
                    event.time + (<FightReel.CritEvent>event).debuff.duration,
                    (<FightReel.CritEvent>event).debuff
                );
                break;
            default:
                break;
        }
    };
}
