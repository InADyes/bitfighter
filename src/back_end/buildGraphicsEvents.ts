import * as GraphicsEvents from '../shared/graphicsEvents';
import * as FightEvents from '../shared/fightEvents';
import { otherCharacter } from '../shared/utility';

export function build(fight: FightEvents.Event[]) {
    let display: GraphicsEvents.Event[] = [];
    
    for (let event of fight) {
        switch (event.type) {
            case FightEvents.EventType.damage:
                display.push(new GraphicsEvents.Health(
                    event.time,
                    event.character,
                    -(<FightEvents.DamageEvent>event).amount
                ));
                display.push(new GraphicsEvents.Text(
                    event.time,
                    event.character,
                    String((<FightEvents.DamageEvent>event).amount),
                    'red'
                ));
                display.push(new GraphicsEvents.Attack(
                    event.time - 150,
                    otherCharacter(event.character)
                ));
                break;
            case FightEvents.EventType.dodge:
                display.push(new GraphicsEvents.Text(
                    event.time,
                    event.character,
                    'dodge',
                    'orange'
                ));
                display.push(new GraphicsEvents.Attack(
                    event.time - 150,
                    otherCharacter(event.character)
                ));
                break;
            case FightEvents.EventType.healing:
                display.push(new GraphicsEvents.Health(
                    event.time,
                    event.character,
                    -(<FightEvents.DamageEvent>event).amount
                ));
                display.push(new GraphicsEvents.Text(
                    event.time,
                    event.character,
                    String((<FightEvents.DamageEvent>event).amount),
                    'red'
                ));
                display.push(new GraphicsEvents.Attack(
                    event.time - 150,
                    otherCharacter(event.character)
                ));
                break;
            case FightEvents.EventType.death:
                display.push(new GraphicsEvents.Clear(
                    event.time,
                    event.character
                ));
                break;
            case FightEvents.EventType.crit:
                display.push(new GraphicsEvents.Text(
                    event.time,
                    event.character,
                    'crit',
                    'red'
                ));
                const debuff = (<FightEvents.CritEvent>event).debuff;
                if (debuff){
                    display.push(new GraphicsEvents.Buff(
                        event.time,
                        event.character,
                        debuff.art,
                        debuff.duration
                    ));
                }
                const buff = (<FightEvents.CritEvent>event).debuff;
                if (buff){
                    display.push(new GraphicsEvents.Buff(
                        event.time,
                        otherCharacter(event.character),
                        buff.art,
                        buff.duration
                    ));
                }
                break;
            case FightEvents.EventType.donation:
                const e = (<FightEvents.DonationEvent>event);

                if (e.donationType === FightEvents.DonationType.damage) {
                    display.push(new GraphicsEvents.Text(
                        event.time,
                        event.character,
                        'donation',
                        'green'
                    ));
                } else {
                    display.push(new GraphicsEvents.Text(
                        event.time,
                        event.character,
                        'donation',
                        'red'
                    ));
                }
                break;
            case FightEvents.EventType.levelUp:
                display.push(new GraphicsEvents.Text(
                    event.time,
                    event.character,
                    'Level Up!',
                    'gold'
                ));
                break;
            default:
                console.error('unidentified event type');
        }
    }

    display.sort((a, b) => {
        return a.time - b.time;
    });

    return display;
}
