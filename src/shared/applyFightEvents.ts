import * as FightEvents from '../shared/fightEvents';
import { Status } from '../shared/Status';
import { otherCharacter } from '../shared/utility';
import { buildStats, characters, levels } from '../shared/characterPicker';
import { build as buildGraphicsEvents } from './buildGraphicsEvents';
import { GraphicsEvent } from './graphicsEvents';
import { assertNever } from './utility';

export interface CombinedEvent {
    fight: FightEvents.FightEvent,
    graphics: GraphicsEvent[]
 };

// also modifies events that would take health too high or low
export function applyFightEvents(
    status: Status[],
    ...reel: FightEvents.FightEvent[]
) {
    const combinedReel: CombinedEvent[] = [];

    for (let event of reel) {
        switch (event.type) {
            case 'damage':
                status[event.character].hitPoints -= event.amount;
                break;
            case 'heal': {
                const c = status[event.character];
                c.hitPoints = Math.min(
                    c.hitPoints + event.amount,
                    c.stats.maxHitPoints
                );
            } break;
            case 'crit': {
                if (event.debuff) {
                    status[event.character].addEffect(
                        event.time + event.debuff.duration,
                        event.debuff
                    );
                }
                if (event.buff) {
                    status[otherCharacter(event.character)].addEffect(
                        event.time + event.buff.duration,
                        event.buff
                    );
                }
            } break;
            case 'death': { // level up also happens here
                status.splice(event.character, 1);
            } break;
            case 'levelUp': {
                // const c = status[event.character];
                // if (c && levels.length > c.level) {
                //     c.level++;
                //     c.baseStats = buildStats(c.character, c.initialDonation, c.level);
                // }
            } break;
            case 'dodge':
            case 'attack':
                break;
            default:
                assertNever(event);
        }
        combinedReel.push({
            fight: event,
            graphics: buildGraphicsEvents(event, status)
        });
    };
    return combinedReel;
}
