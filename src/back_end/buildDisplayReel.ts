import * as DisplayReel from '../shared/displayReel';
import * as FightReel from '../shared/fightReel';
import { otherCharacter } from '../shared/utility';

export function build(fight: FightReel.Event[]) {
    let display: DisplayReel.Event[] = [];
    
    for (let event of fight) {
        switch (event.type) {
            case FightReel.EventType.damage:
                display.push(new DisplayReel.Health(
                    event.time,
                    event.character,
                    -(<FightReel.DamageEvent>event).amount
                ));
                display.push(new DisplayReel.Text(
                    event.time,
                    event.character,
                    String((<FightReel.DamageEvent>event).amount),
                    'red'
                ));
                display.push(new DisplayReel.Attack(
                    event.time - 150,
                    otherCharacter(event.character)
                ));
                break;
            case FightReel.EventType.dodge:
                display.push(new DisplayReel.Text(
                    event.time,
                    event.character,
                    'dodge',
                    'orange'
                ));
                display.push(new DisplayReel.Attack(
                    event.time - 150,
                    otherCharacter(event.character)
                ));
                break;
            case FightReel.EventType.healing:
                display.push(new DisplayReel.Health(
                    event.time,
                    event.character,
                    -(<FightReel.DamageEvent>event).amount
                ));
                display.push(new DisplayReel.Text(
                    event.time,
                    event.character,
                    String((<FightReel.DamageEvent>event).amount),
                    'red'
                ));
                display.push(new DisplayReel.Attack(
                    event.time - 150,
                    otherCharacter(event.character)
                ));
                break;
            case FightReel.EventType.death:
                display.push(new DisplayReel.Clear(
                    event.time,
                    event.character
                ));
                break;
            case FightReel.EventType.crit:
                display.push(new DisplayReel.Text(
                    event.time,
                    event.character,
                    'crit',
                    'red'
                ));
                const debuff = (<FightReel.CritEvent>event).debuff;
                if (debuff){
                    display.push(new DisplayReel.Buff(
                        event.time,
                        event.character,
                        debuff.art,
                        debuff.duration
                    ));
                }
                const buff = (<FightReel.CritEvent>event).debuff;
                if (buff){
                    display.push(new DisplayReel.Buff(
                        event.time,
                        otherCharacter(event.character),
                        buff.art,
                        buff.duration
                    ));
                }
                break;
            case FightReel.EventType.donation:
                const e = (<FightReel.DonationEvent>event);

                if (e.donationType === FightReel.DonationType.damage) {
                    display.push(new DisplayReel.Text(
                        event.time,
                        event.character,
                        'donation',
                        'green'
                    ));
                } else {
                    display.push(new DisplayReel.Text(
                        event.time,
                        event.character,
                        'donation',
                        'red'
                    ));
                }
                break;
            case FightReel.EventType.levelUp:
                display.push(new DisplayReel.Text(
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
