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
                Math.ceil(status[event.character].hitPoints)
            ));
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                String(Math.ceil((<FightEvents.Damage>event).amount)),
                'red'
            ));
            break;
        case FightEvents.Types.dodge:
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                'dodge',
                'orange'
            ));
            break;
        case FightEvents.Types.healing:
            display.push(new GraphicsEvents.Health(
                event.time,
                event.character,
                Math.ceil(status[event.character].hitPoints)
            ));
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                String(Math.ceil((<FightEvents.Healing>event).amount)),
                'green'
            ));
            break;
        case FightEvents.Types.death:
            display.push(new GraphicsEvents.Clear(
                event.time,
                event.character
            ));
            break;
        case FightEvents.Types.crit: {
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                'crit',
                'red'
            ));
            const { buff, debuff } = <FightEvents.Crit>event;
            if (debuff) {
                display.push(new GraphicsEvents.Buff(
                    event.time,
                    event.character,
                    debuff.art,
                    debuff.duration
                ));
            }
            if (buff) {
                display.push(new GraphicsEvents.Buff(
                    event.time,
                    otherCharacter(event.character),
                    buff.art,
                    buff.duration
                ));
            }
        }   break;
        case FightEvents.Types.damageDonation: {
            const e = <FightEvents.DamageDonation>event;

            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                `${ e.donation.name} attacks`,
                'purple'
            ));
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                String(Math.ceil(e.amount)),
                'red'
            ));
            display.push(new GraphicsEvents.Health(
                event.time,
                event.character,
                Math.ceil(status[event.character].hitPoints)
            ));
        }   break;
        case FightEvents.Types.healingDonation: {
            const e = (<FightEvents.HealingDonation>event);

            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                `${ e.donation.name } heals`,
                'purple'
            ));
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character,
                String(Math.ceil(e.amount)),
                'green'
            ));
            display.push(new GraphicsEvents.Health(
                event.time,
                event.character,
                Math.ceil(status[event.character].hitPoints)
            ));
        }   break;
        case FightEvents.Types.attack:
            display.push(new GraphicsEvents.Attack(
                event.time - 150,
                event.character
            ));
            break;
        case FightEvents.Types.levelUp:
            display.push(new GraphicsEvents.Text(
                event.time,
                event.character, //should this always be zero or be characterOther()?
                'Level Up!',
                'gold'
            ));
            break;
        default:
            console.error('unidentified event type');
    }
    return display;
}
