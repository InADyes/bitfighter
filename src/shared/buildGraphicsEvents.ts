import { applyFightEvents } from './applyFightEvents';
import * as GraphicsEvents from './graphicsEvents';
import * as FightEvents from './fightEvents';
import { otherCharacter } from './utility';
import { Status } from './Status';

// could be programatically genrated in a cleaner way if we end up with a lot
// used to determine order of events when the timestamp is the same
const eventOrder = {
    [GraphicsEvents.EventType.Attack]: 1,
    [GraphicsEvents.EventType.Buff]: 1,
    [GraphicsEvents.EventType.Clear]: 2,
    [GraphicsEvents.EventType.Health]: 1,
    [GraphicsEvents.EventType.Text]: 1
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

export function build(event: FightEvents.Event, status: Status[]) {
    const display: GraphicsEvents.Event[] = [];

    switch (event.type) {
        case FightEvents.Types.damage:
            display.push(new GraphicsEvents.Health(
                event.time,
                event.character,
                null,
                Math.max(0, Math.ceil(status[event.character].hitPoints))
            ));
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                1,
                String(Math.ceil((<FightEvents.Damage>event).amount)),
                colors.damage
            ));
            break;
        case FightEvents.Types.dodge:
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                .72,
                'dodge',
                colors.dodge
            ));
            break;
        case FightEvents.Types.healing:
            display.push(new GraphicsEvents.Health(
                event.time,
                event.character,
                null,
                Math.ceil(status[event.character].hitPoints)
            ));
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                1,
                String(Math.ceil((<FightEvents.Healing>event).amount)),
                colors.heal
            ));
            break;
        case FightEvents.Types.death:
            display.push(new GraphicsEvents.Clear(
                event.time,
                event.character
            ));
            break;
        case FightEvents.Types.crit: {
            const { buff, debuff, damage } = <FightEvents.Crit>event;
            if (damage) {
                display.push(new GraphicsEvents.Text(
                    event.time,
                    event.character,
                    1,
                    'crit',
                    colors.damage
                ));
            }
            if (debuff) {
                display.push(new GraphicsEvents.Buff(
                    event.time,
                    event.character,
                    debuff.art,
                    debuff.duration
                ));
                display.push(new GraphicsEvents.Text(
                    event.time,
                    event.character,
                    1,
                    debuff.name,
                    colors.ability
                ));
            }
            if (buff) {
                display.push(new GraphicsEvents.Buff(
                    event.time,
                    otherCharacter(event.character),
                    buff.art,
                    buff.duration
                ));
                display.push(new GraphicsEvents.Text(
                    event.time,
                    otherCharacter(event.character),
                    1,
                    buff.name,
                    colors.ability
                ));
            }
        }   break;
        case FightEvents.Types.damageDonation: {
            const e = <FightEvents.DamageDonation>event;

            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                1.5,
                `${ e.donation.name} attacks`,
                colors.donation
            ));
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                1.5,
                String(Math.ceil(e.amount)),
                colors.damage
            ));
            display.push(new GraphicsEvents.Health(
                event.time,
                event.character,
                e.donation.name,
                Math.ceil(status[event.character].hitPoints)
            ));
        }   break;
        case FightEvents.Types.healingDonation: {
            const e = (<FightEvents.HealingDonation>event);

            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                1,
                `${ e.donation.name } heals`,
                colors.donation
            ));
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                1,
                String(Math.ceil(e.amount)),
                colors.heal
            ));
            display.push(new GraphicsEvents.Health(
                event.time,
                event.character,
                null,
                Math.ceil(status[event.character].hitPoints)
            ));
        }   break;
        case FightEvents.Types.attack:
            display.push(new GraphicsEvents.Attack(
                event.time - 125,
                event.character
            ));
            break;
        case FightEvents.Types.levelUp:
            // display.push(new GraphicsEvents.Text(
            //     event.time,
            //     event.character, //should this always be zero or be characterOther()?
            //     'Level Up!',
            //     'gold'
            // ));
            break;
        default:
            console.error('unidentified event type');
    }
    return display;
}
