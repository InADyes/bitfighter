import * as GraphicsEvents from '../../shared/interfaces/graphicsEvents';
import { GameState } from './Gamestate'

//define function bitBoss

export function fireEvent(event: GraphicsEvents.Event, gameState: GameState){
    let char = event.character;
    switch(event.type) {
        case 'health':
            //console.log(`CHARACTER ${ char } CHANGES HEALTH BY ${ (<GraphicsEvents.Health>event).health }`);
            gameState.changeHealth(char, (<GraphicsEvents.Health>event).health, (<GraphicsEvents.Health>event).attacker)
            break;
        case 'attack':
            //console.log(`CHARACTER ${ char } ATTACKS`)
            gameState.attack(char);
            break;
        case 'clear':
            //console.log(`CHARACTER ${ char } DIES`);
            gameState.slay(char);
            break;
        case 'text':
            //console.log(`CHARACTER ${ char } SAYS ${ (<GraphicsEvents.Text>event).text }`);
            gameState.displayText(char, (<GraphicsEvents.Text>event).text, (<GraphicsEvents.Text>event).color, (<GraphicsEvents.Text>event).duration)
            break;
        case 'buff':
            gameState.addBuff((<GraphicsEvents.Buff>event).art, (<GraphicsEvents.Buff>event).duration, char)
            break;
        default:
            console.error('unidentified event type')
    }
}