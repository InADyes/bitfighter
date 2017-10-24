import { applyFightEvents } from './applyFightEvents';
import { GraphicsEvent } from './interfaces/graphicsEvents';
import { FightEvent } from './interfaces/fightEvents';
import { otherCharacter, assertNever } from './utility';
import { Status } from './Status';

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

export function build(event: FightEvent, status: Status[]) {
    const display: GraphicsEvent[] = [];
    const { time, character } = event;

    switch (event.type) {
        case 'damage':
            if (event.source.type === 'donation') {
                const d = event.source.donation;

                display.push({
                    type: 'text',
                    time,
                    character,
                    duration: 1.5,
                    text: `${ d.name} attacks`,
                    color: colors.damage 
                })
                display.push({
                    type: 'text',
                    time,
                    character,
                    duration: 1.5,
                    text: String(Math.ceil(d.amount)),
                    color: colors.damage
                });
                display.push({
                    type: 'health',
                    time,
                    character,
                    attacker: d.name,
                    health: Math.ceil(status[character].hitPoints)
                });
            } else {
                display.push({
                    type: 'health',
                    time,
                    character,
                    attacker: null,
                    health: Math.max(0, Math.ceil(status[character].hitPoints))
                });
                display.push({
                    type: 'text',
                    time,
                    character,
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
                character,
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
                    character,
                    duration: 1,
                    text: `${ event.source.donation.name } heals`,
                    color: colors.donation
                });
                display.push({
                    type: 'text',
                    time,
                    character,
                    duration: 1,
                    text: String(Math.ceil(event.amount)),
                    color: colors.heal
                });
                display.push({
                    type: 'health',
                    time,
                    character,
                    attacker: null,
                    health: Math.ceil(status[character].hitPoints)
                });
            } else {
                display.push({
                    type: 'health',
                    time,
                    character,
                    attacker: null,
                    health: Math.ceil(status[character].hitPoints)
                });
                display.push({
                    type: 'text',
                    time,
                    character,
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
                character
            });
            break;
        case 'crit': {
            const { buff, debuff, damage } = event;
            if (damage) {
                display.push({
                    type: 'text',
                    time,
                    character,
                    duration: 1,
                    text: 'crit',
                    color: colors.damage
                });
            }
            if (debuff) {
                display.push({
                    type: 'buff',
                    time,
                    character,
                    art: debuff.art,
                    duration: debuff.duration
                });
                display.push({
                    type: 'text',
                    time,
                    character,
                    duration: 1,
                    text: debuff.name,
                    color: colors.ability
                });
            }
            if (buff) {
                display.push({
                    type: 'buff',
                    time,
                    character: otherCharacter(character),
                    art: buff.art,
                    duration: buff.duration
                });
                display.push({
                    type: 'text',
                    time,
                    character: otherCharacter(character),
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
                character
            });
            break;
        case 'levelUp':
            // display.push(new GraphicsEvents.Text(
            //     time,
            //     character, //should this always be zero or be characterOther()?
            //     'Level Up!',
            //     'gold'
            // ));
            break;
        default:
            assertNever(event);
    }
    return display;
}
