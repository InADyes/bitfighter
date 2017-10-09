import * as GraphicsEvents from '../../shared/graphicsEvents';
import { GameState } from './Gamestate'

export function fireEvent(event: GraphicsEvents.Event, gameState: GameState){
    let char = event.character;
    switch(event.type) {
        case GraphicsEvents.EventType.Health:
            //console.log(`CHARACTER ${ char } CHANGES HEALTH BY ${ (<GraphicsEvents.Health>event).health }`);
            gameState.changeHealth(char, (<GraphicsEvents.Health>event).health);
            //if (p2 && this.player2)
		// 	this.player2.adjustHp(newHp);
		// else if (this.player1) {
		// 	let p = this.player1.getBitBossInfo();
		// 	recalcHp(p.hp - newHp, newHp, p.maxHp, "hello world");
		// 	this.player1.adjustHp(newHp);
		//}
            break;
        case GraphicsEvents.EventType.Attack:
            //console.log(`CHARACTER ${ char } ATTACKS`)
            gameState.attack(char);
            break;
        case GraphicsEvents.EventType.Clear:
            //console.log(`CHARACTER ${ char } DIES`);
            gameState.slay(char);
            break;
        case GraphicsEvents.EventType.Text:
            //console.log(`CHARACTER ${ char } SAYS ${ (<GraphicsEvents.Text>event).text }`);
            gameState.displayText(char, (<GraphicsEvents.Text>event).text, (<GraphicsEvents.Text>event).color)
            break;
        case GraphicsEvents.EventType.Buff:
            gameState.addBuff((<GraphicsEvents.Buff>event).art, (<GraphicsEvents.Buff>event).duration, char)
            break;
        default:
            console.error('unidentified event type')
    }
}