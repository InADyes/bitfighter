import { Combatant } from './Combatant';
import { FightEvent } from './interfaces/fightEvents';
import { GraphicsEvent } from './interfaces/graphicsEvents';
import { assertNever, otherCharacter } from './utility';

// could be programatically genrated in a cleaner way if we end up with a lot
// used to determine order of events when the timestamp is the same
const eventOrder: {[type: string]: number} = {
    'attack': 1,
    'buff': 1,
    'clear': 2,
    'health': 1,
    'text': 1
}

const enum colors {
    damage = '#f00e53',
    dodge = '#09d2d9',
    donation = '#8de82c',
    heal = '#21e4c6',
    ability = '#f34ef5'
}

export function sortGraphicsEvents(events: GraphicsEvent[]) {
    return events.sort((a, b) => {
        if (a.time === b.time)
            return eventOrder[a.type] - eventOrder[b.type];
        return a.time - b.time;
    });
}

/**
 * Creates the graphics events resulting from given fight event.
 * @param combatant Required so that id identifiers used in fight events can become index's.
 */
export function buildGraphicsEvents(event: FightEvent, combatant: Combatant[]): GraphicsEvent[] {
    const display: GraphicsEvent[] = [];
    const time  = event.time;
    const targetIndex = combatant.findIndex(s => s.id === event.targetID);

    if (targetIndex === -1) {
        console.error('invalid target: ', event.targetID);
        return [];
    }

    switch (event.type) {
        case 'damage':
            if (event.source.type === 'donation') {
                const d = event.source.donation;

                display.push({
                    type: 'text',
                    time,
                    character: targetIndex,
                    duration: 1.5,
                    text: `${ d.name} attacks`,
                    color: colors.damage 
                })
                display.push({
                    type: 'text',
                    time,
                    character: targetIndex,
                    duration: 1.5,
                    text: String(Math.ceil(d.amount)),
                    color: colors.damage
                });
                display.push({
                    type: 'health',
                    time,
                    character: targetIndex,
                    attacker: d.name,
                    health: Math.ceil(combatant[targetIndex].hitPoints)
                });
            } else {
                display.push({
                    type: 'health',
                    time,
                    character: targetIndex,
                    attacker: null,
                    health: Math.max(0, Math.ceil(combatant[targetIndex].hitPoints))
                });
                display.push({
                    type: 'text',
                    time,
                    character: targetIndex,
                    duration: 1,
                    text: String(Math.ceil(event.amount)),
                    color: colors.damage
                });
            }
            break;
        case 'dodge':
            display.push({
                type: 'text',
                time,
                character: targetIndex,
                duration: .72,
                text: 'dodge',
                color: colors.dodge
            });
            break;
        case 'heal':
            if (event.source.type === 'donation') {
                display.push({
                    type: 'text',
                    time,
                    character: targetIndex,
                    duration: 1,
                    text: `${ event.source.donation.name } heals`,
                    color: colors.donation
                });
                display.push({
                    type: 'text',
                    time,
                    character: targetIndex,
                    duration: 1,
                    text: String(Math.ceil(event.amount)),
                    color: colors.heal
                });
                display.push({
                    type: 'health',
                    time,
                    character: targetIndex,
                    attacker: null,
                    health: Math.ceil(combatant[targetIndex].hitPoints)
                });
            } else {
                display.push({
                    type: 'health',
                    time,
                    character: targetIndex,
                    attacker: null,
                    health: Math.ceil(combatant[targetIndex].hitPoints)
                });
                display.push({
                    type: 'text',
                    time,
                    character: targetIndex,
                    duration: 1,
                    text: String(Math.ceil(event.amount)),
                    color: colors.heal
                });
            }
            break;
        case 'death':
            display.push({
                type: 'clear',
                time,
                character: targetIndex
            });
            break;
        case 'crit': {
            const { buff, debuff, damage } = event;
            if (damage) {
                display.push({
                    type: 'text',
                    time,
                    character: targetIndex,
                    duration: 1,
                    text: 'crit',
                    color: colors.damage
                });
            }
            if (debuff) {
                display.push({
                    type: 'buff',
                    time,
                    character: targetIndex,
                    art: debuff.artPath,
                    duration: debuff.duration
                });
                display.push({
                    type: 'text',
                    time,
                    character: targetIndex,
                    duration: 1,
                    text: debuff.name,
                    color: colors.ability
                });
            }
            if (buff) {
                display.push({
                    type: 'buff',
                    time,
                    character: otherCharacter(targetIndex),
                    art: buff.artPath,
                    duration: buff.duration
                });
                display.push({
                    type: 'text',
                    time,
                    character: otherCharacter(targetIndex),
                    duration: 1,
                    text: buff.name,
                    color: colors.ability
                });
            }
        }   break;
        case 'attack':
            display.push({
                type: 'attack',
                time: time - 125,
                character: targetIndex
            });
            break;
        case 'levelUp':
            break;
        default:
            assertNever(event);
    }
    return display;
}
