import * as GraphicsEvents from '../shared/graphicsEvents';
import { GameState } from './Display'

export function fireEvent(event: GraphicsEvents.Event, gameState: GameState){
    let char = event.character;
    switch(event.type) {
        case GraphicsEvents.EventType.Health:
            console.log(`CHANGE HEALTH`);
            break;
        case GraphicsEvents.EventType.Attack:
            console.log(`ATTACK`);
            gameState.attack(char);
            break;
        case GraphicsEvents.EventType.Clear:
            console.log(`SOMEONE DIES`);
            break;
        case GraphicsEvents.EventType.Text:
            console.log(`DISPLAY SOME TEXT`);
            break;
        case GraphicsEvents.EventType.Buff:
            console.log(`BUFF SOMEONE`);
            break;
        default:
            console.error('unidentified event type')
    }
}