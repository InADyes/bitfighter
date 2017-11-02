
import { FrontendCharacter } from '../shared/interfaces/backToFrontMessage';
import { GraphicsEvent } from '../shared/interfaces/graphicsEvents';
import { assertNever } from '../shared/utility';

export default function applyNextEvent(
    event: GraphicsEvent,
    combatants: FrontendCharacter[]
): FrontendCharacter[] {
    switch (event.type) {
        case 'health':
            //this.state.combatants[event.character].currentHitPoints = event.health;
            break;
        case 'attack':
            console.log(`character ${ event.character} attacks`);
            break;
        case 'clear':
            //this.state.combatants.splice(event.character, 1);
            break;
        case 'text':
            console.log('text out: ', event.text);
            break;
        case 'buff':
            console.log('buff: ', event.character);
            break;
        default:
            assertNever(event);
    }
}
