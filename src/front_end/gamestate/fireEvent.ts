import { GraphicsEvent } from '../../shared/interfaces/graphicsEvents';
import { GameState } from './Gamestate'
import {assertNever} from '../../shared/utility'

//define function bitBoss

export function fireEvent(event: GraphicsEvent, gameState: GameState){
    const char = event.character;
    switch(event.type) {
        case 'health':
            //console.log(`CHARACTER ${ char } CHANGES HEALTH BY ${ (<GraphicsEvents.Health>event).health }`);
            gameState.changeHealth(char, event.health, event.attacker)
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
            gameState.displayText(char, event.text, event.color, event.duration)
            break;
        case 'buff':
            gameState.addBuff(event.art, event.duration, char)
            break;
        default:
            assertNever(event);
    }
}