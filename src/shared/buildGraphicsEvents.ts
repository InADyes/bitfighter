import { applyFightEvents } from './applyFightEvents';
import { GraphicsEvent } from './graphicsEvents';
import { FightEvent } from './fightEvents';
import { otherCharacter, assertNever } from './utility';
import { Status } from './Status';

// could be programatically genrated in a cleaner way if we end up with a lot
// used to determine order of events when the timestamp is the same
const eventOrder: {[type: string]: number} = {
    'attack': 1,
    'buff': 1,
    'clear': 2,
    // [GraphicsEvents.EventType.Health]: 1,
    // [GraphicsEvents.EventType.Text]: 1
}

const enum colors {
    damage = '#f00e53',
    dodge = '#09d2d9',
    donation = '#8de82c',
    heal = '#21e4c6',
    ability = '#f34ef5'
}

export function sortGraphicsEvents(events: GraphicsEvents.Event[]) {
    return events.sort((a, b) => {
        if (a.time === b.time)
            return eventOrder[a.type] - eventOrder[b.type];
        return a.time - b.time;
    });
}

export function build(event: FightEvent, status: Status[]) {
    const display: GraphicsEvents.Event[] = [];
    const { time, character } = event;

    switch (event.type) {
        case 'damage':
            if (event.source.type === 'donation') {
                const d = event.source.donation;

                display.push(new GraphicsEvents.Text(
                    time,
                    character,
                    1.5,
                    `${ d.name} attacks`,
                    colors.damage
                ));
                display.push(new GraphicsEvents.Text(
                    time,
                    character,
                    1.5,
                    String(Math.ceil(d.amount)),
                    colors.damage
                ));
                display.push(new GraphicsEvents.Health(
                    time,
                    character,
                    d.name,
                    Math.ceil(status[character].hitPoints)
                ));
            } else {
                display.push(new GraphicsEvents.Health(
                    time,
                    character,
                    null,
                    Math.max(0, Math.ceil(status[character].hitPoints))
                ));
                display.push(new GraphicsEvents.Text(
                    time,
                    character,
                    1,
                    String(Math.ceil(event.amount)),
                    colors.damage
                ));
            }
            break;
        case 'dodge':
            display.push(new GraphicsEvents.Text(
                time,
                character,
                .72,
                'dodge',
                colors.dodge
            ));
            break;
        case 'heal':
            if (event.source.type === 'donation') {
                display.push(new GraphicsEvents.Text(
                    time,
                    character,
                    1,
                    `${ event.source.donation.name } heals`,
                    colors.donation
                ));
                display.push(new GraphicsEvents.Text(
                    time,
                    character,
                    1,
                    String(Math.ceil(event.amount)),
                    colors.heal
                ));
                display.push(new GraphicsEvents.Health(
                    time,
                    character,
                    null,
                    Math.ceil(status[character].hitPoints)
                ));
            } else {
                display.push(new GraphicsEvents.Health(
                    time,
                    character,
                    null,
                    Math.ceil(status[character].hitPoints)
                ));
                display.push(new GraphicsEvents.Text(
                    time,
                    character,
                    1,
                    String(Math.ceil(event.amount)),
                    colors.heal
                ));
            }
            break;
        case 'death':
            display.push(new GraphicsEvents.Clear(
                time,
                character
            ));
            break;
        case 'crit': {
            const { buff, debuff, damage } = event;
            if (damage) {
                display.push(new GraphicsEvents.Text(
                    time,
                    character,
                    1,
                    'crit',
                    colors.damage
                ));
            }
            if (debuff) {
                display.push(new GraphicsEvents.Buff(
                    time,
                    character,
                    debuff.art,
                    debuff.duration
                ));
                display.push(new GraphicsEvents.Text(
                    time,
                    character,
                    1,
                    debuff.name,
                    colors.ability
                ));
            }
            if (buff) {
                display.push(new GraphicsEvents.Buff(
                    time,
                    otherCharacter(character),
                    buff.art,
                    buff.duration
                ));
                display.push(new GraphicsEvents.Text(
                    time,
                    otherCharacter(character),
                    1,
                    buff.name,
                    colors.ability
                ));
            }
        }   break;
        case 'attack':
            display.push(new GraphicsEvents.Attack(
                time - 125,
                character
            ));
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
