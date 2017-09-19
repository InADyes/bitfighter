import * as FightReel from '../shared/fightReel';
import { Status } from '../shared/Status';

function otherCharacter(char: number) {
    switch (char) {
        case 0:
            return 1;
        case 1:
            return 0;
        default:
            console.error('bad character');
            process.exit();
            return -1; // typescript does not recognise exit
    }
}

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
            default:
                break;
        }
    };
}
