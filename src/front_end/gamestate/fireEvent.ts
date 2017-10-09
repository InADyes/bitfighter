import * as GraphicsEvents from '../../shared/graphicsEvents';
import { GameState } from './Gamestate'

//define function bitBoss

export function fireEvent(event: GraphicsEvents.Event, gameState: GameState){
    let char = event.character;
    switch(event.type) {
        case GraphicsEvents.EventType.Health:
            //console.log(`CHARACTER ${ char } CHANGES HEALTH BY ${ (<GraphicsEvents.Health>event).health }`);
<<<<<<< HEAD
            gameState.changeHealth(char, (<GraphicsEvents.Health>event).health);
            //if (p2 && this.player2)
		// 	this.player2.adjustHp(newHp);
		// else if (this.player1) {
		// 	let p = this.player1.getBitBossInfo();
		// 	recalcHp(p.hp - newHp, newHp, p.maxHp, "hello world");
		// 	this.player1.adjustHp(newHp);
		//}
=======
            gameState.changeHealth(char, (<GraphicsEvents.Health>event).health, (<GraphicsEvents.Health>event).attacker)
>>>>>>> 2cdd466357d4162c81a5c02d111b713c065ac6ff
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
            gameState.displayText(char, (<GraphicsEvents.Text>event).text, (<GraphicsEvents.Text>event).color, (<GraphicsEvents.Text>event).duration)
            break;
        case GraphicsEvents.EventType.Buff:
            gameState.addBuff((<GraphicsEvents.Buff>event).art, (<GraphicsEvents.Buff>event).duration, char)
            break;
        default:
            console.error('unidentified event type')
    }
}