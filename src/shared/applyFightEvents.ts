import { FightEvent } from '../shared/interfaces/fightEvents';
import { Combatant } from '../shared/Combatant';
import { otherCharacter } from '../shared/utility';
import { buildStats, characters, levels } from '../shared/characterPicker';
import { buildGraphicsEvents } from './buildGraphicsEvents';
import { GraphicsEvent } from './interfaces/graphicsEvents';
import { assertNever } from './utility';
import { CombinedEvent } from '../shared/interfaces/interfaces';

/**
 * Applies events to the given combatants.
 */
export function applyFightEvents(
    combatant: Combatant[],
    ...reel:FightEvent[]
) {
    const combinedReel: CombinedEvent[] = [];

    for (let event of reel) {
        const target = combatant.find(s => s.id === event.targetID);
        if (target === undefined) {
            console.error('invalid target id:', event.targetID);
            continue;
        }

        switch (event.type) {
            case 'damage':
                target.hitPoints -= event.amount;
                break;
            case 'heal':
                target.hitPoints = Math.min(
                    target.hitPoints + event.amount,
                    target.stats.maxHitPoints
                );
                break;
            case 'crit':
                if (event.debuff) {
                    target.addEffect(
                        event.time + event.debuff.duration,
                        event.debuff
                    );
                }
                if (event.buff && event.source.type === 'combatant') {
                    const id = event.source.id;
                    const s = combatant.find(s => s.id === id);
                    if (s) {
                        s.addEffect(
                            event.time + event.buff.duration,
                            event.buff
                        );
                    }
                }
                break;
            case 'death':
            case 'levelUp':
            case 'dodge':
            case 'attack':
                break;
            default:
                assertNever(event);
        }
        combinedReel.push({
            fight: event,
            graphics: buildGraphicsEvents(event, combatant)
        });

        // if somone dies recalculate the positions after building the graphics
        if (event.type === 'death') {
            const i = combatant.findIndex(s => s === target);
            if (i === -1)
                console.error('could not remove character:', event.targetID);
            else
                combatant.splice(i, 1);
        }
    };
    return combinedReel;
}
