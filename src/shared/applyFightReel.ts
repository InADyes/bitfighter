import * as FightReel from '../shared/fightReel';
import { Status } from '../shared/Status';
import { otherCharacter } from '../shared/utility';
import { buildStats } from '../shared/characterPicker';

/*
    does not delete characters
*/
export function applyFightReel(
    status: Status[],
    ...reel: FightReel.Event[]
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
                const debuff = (<FightReel.CritEvent>event).debuff;
                if (debuff) {
                    status[event.character].addEffect(
                        event.time + debuff.duration,
                        debuff
                    );
                }
                const buff = (<FightReel.CritEvent>event).buff;
                if (buff) {
                    status[otherCharacter(event.character)].addEffect(
                        event.time + buff.duration,
                        buff
                    );
                }
                break;
            case FightReel.EventType.levelUp:
                const c = status[event.character];
                c.stats = buildStats(c.character, c.donation, c.level);
                break;
            default:
                break;
        }
    };
}
