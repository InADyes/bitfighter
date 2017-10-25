import * as FightEvents from '../shared/interfaces/fightEvents';
import { Status } from '../shared/Status';
import { otherCharacter } from '../shared/utility';
import { buildStats, characters, levels } from '../shared/characterPicker';
import { build as buildGraphicsEvents } from './buildGraphicsEvents';
import { GraphicsEvent } from './interfaces/graphicsEvents';
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
        const target = status.find(s => s.id === event.targetID);
        if (target === undefined) {
            console.error('invalid target id:', event.targetID);
            continue;
        }

        switch (event.type) {
            case 'damage':
                target.hitPoints -= event.amount;
                break;
            case 'heal': {
                target.hitPoints = Math.min(
                    target.hitPoints + event.amount,
                    target.stats.maxHitPoints
                );
            } break;
            case 'crit': {
                if (event.debuff) {
                    target.addEffect(
                        event.time + event.debuff.duration,
                        event.debuff
                    );
                }
                if (event.buff && event.source.type === 'combatant') {
                    event.source.status.addEffect(
                        event.time + event.buff.duration,
                        event.buff
                    );
                }
            } break;
            case 'death': { // level up also happens here
            //     const i = status.findIndex(s => s !== s);
            //     if (i === -1)
            //         console.error('could not remove character:', event.target);
            //     else {
            //         status.splice(i, 1);
            //         // recalculate positions (doing it after the graphics event for now)
            //         // status.forEach((s, i) => s.position = (i === 0 ? 'boss' : 'challenger'));
            //     }
            } break;
            case 'levelUp': {
                // const c = target;
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

        // if somone dies recalculate the positions after building the graphics
        if (event.type === 'death') {
            const i = status.findIndex(s => s === target);
            if (i === -1)
                console.error('could not remove character:', event.targetID);
            else
                status.splice(i, 1);
        }
    };
    return combinedReel;
}
