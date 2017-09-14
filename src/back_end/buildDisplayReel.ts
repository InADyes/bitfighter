import * as Status from '../shared/statusTypes';
import * as DisplayReel from '../shared/displayReel';
import * as FightReel from '../shared/fightReel';

function otherCharacter(char: number) {
    switch (char) {
        case 0:
            return 1;
        case 1:
            return 0;
        default:
            console.error('bad character');
            process.exit();
            return -1; // typescript does not recognise exit
    }
}

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
                    'red'
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
            default:
                console.error('bad event type');
                process.exit();
        }
    }

    display.sort((a, b) => {
        return a.time - b.time;
    });

    return display;
}
