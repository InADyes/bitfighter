import { applyFightEvents } from '../shared/applyFightEvents';
import * as GraphicsEvents from '../shared/graphicsEvents';
import * as FightEvents from '../shared/fightEvents';
import { otherCharacter } from '../shared/utility';
import { Status } from '../shared/Status';
// could be programatically genrated in a cleaner way if we end up with a lot
// used to determine order of events when the timestamp is the same
const eventOrder = {
    [GraphicsEvents.EventType.Attack]: 1,
    [GraphicsEvents.EventType.Buff]: 1,
    [GraphicsEvents.EventType.Clear]: 2,
    [GraphicsEvents.EventType.Health]: 1,
    [GraphicsEvents.EventType.Text]: 1
}


export function build(fight: FightEvents.Event[], originalStatus: Status[]) {
    let display: GraphicsEvents.Event[] = [];

    const status = originalStatus.map(s => s.clone());
    
    for (let event of fight) {
        applyFightEvents(status, event);

        switch (event.type) {
            case FightEvents.Types.damage:
                display.push(new GraphicsEvents.Health(
                    event.time,
                    event.character,
                    status[event.character].hitPoints
                ));
                display.push(new GraphicsEvents.Text(
                    event.time,
                    event.character,
                    String((<FightEvents.Damage>event).amount),
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
                    status[event.character].hitPoints
                ));
                display.push(new GraphicsEvents.Text(
                    event.time,
                    event.character,
                    String((<FightEvents.Healing>event).amount),
                    'green'
                ));
                break;
            case FightEvents.Types.death:
                display.push(new GraphicsEvents.Clear(
                    event.time,
                    event.character
                ));
                break;
            case FightEvents.Types.crit:
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
                break;
            case FightEvents.Types.donation:
                const e = (<FightEvents.Donation>event);

                if (e.donationType === FightEvents.DonationType.damage) {
                    display.push(new GraphicsEvents.Text(
                        event.time,
                        event.character,
                        'donation',
                        'yellow'
                    ));
                } else {
                    display.push(new GraphicsEvents.Text(
                        event.time,
                        event.character,
                        'donation',
                        'yellow'
                    ));
                }
                break;
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
    }

    display.sort((a, b) => {
        if (a.time === b.time)
            return eventOrder[a.type] - eventOrder[b.type];
        return a.time - b.time;
        
    });

    return display;
}
