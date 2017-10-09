import * as FightEvents from '../shared/fightEvents';
import { Status } from '../shared/Status';
import { otherCharacter } from '../shared/utility';
import { buildStats, levels } from '../shared/characterPicker';
import { build as buildGraphicsEvents } from './buildGraphicsEvents';
import { Event as GraphicsEvent } from './graphicsEvents';

export interface CombinedEvent {
    fight: FightEvents.Event,
    graphics: GraphicsEvent[]
 };

// also modifies events that would take health too high or low
export function applyFightEvents(
    status: Status[],
    ...reel: FightEvents.Event[]
) {
    const combinedReel: CombinedEvent[] = [];

    for (let event of reel) {
        switch (event.type) {
            case FightEvents.Types.damage:
                status[event.character].hitPoints -= (<FightEvents.Damage>event).amount;
                break;
            case FightEvents.Types.healing:
                status[event.character].hitPoints += (<FightEvents.Healing>event).amount;
                break;
            case FightEvents.Types.crit: {
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
            } break;
            case FightEvents.Types.death: { // level up also happens here
                status.splice(event.character, 1);
            } break;
            case FightEvents.Types.levelUp: {
                // const c = status[event.character];
                // if (c && levels.length > c.level) {
                //     c.level++;
                //     c.baseStats = buildStats(c.character, c.initialDonation, c.level);
                // }
            } break;
            case FightEvents.Types.damageDonation: {
                status[event.character].hitPoints -= (<FightEvents.DamageDonation>event).amount;
            } break;
            case FightEvents.Types.healingDonation: {
                status[event.character].hitPoints += (<FightEvents.HealingDonation>event).amount;
            } break;
        }
        combinedReel.push({
            fight: event,
            graphics: buildGraphicsEvents(event, status)
        })
    };
    return combinedReel;
}
