import * as FightEvents from './fightEvents';
import { Event as GraphicsEvent } from './graphicsEvents';
import { Combatant } from './Combatant';
import { Status } from '../shared/Status';
import { applyFightEvents, CombinedEvent } from './applyFightEvents';
import { otherCharacter  as other} from './utility';
import { buffs, types as buffTypes } from './buff';
import * as BuildGraphicsEvents from './buildGraphicsEvents';

export function buildEvents(status: Status[], startTime?: number) {
    const reel: CombinedEvent[] = [];
    const newStatus = status.map(s => s.clone());
    const combatants = newStatus.map((status, index) => new Combatant(
        status,
        index,
        event => reel.push(...applyFightEvents(newStatus, event)),
        attack => {combatants.filter(c => c != attack.attacker)[0].takeHit(attack);},
        startTime
    ));

    if (combatants.length < 2) {
        console.log('not enough combatants to fight');
        if (combatants[0] && combatants[0].status.hitPoints <= 0) {
            reel.push(...applyFightEvents(newStatus, new FightEvents.Death(
                combatants[0].time,
                0
            )));
        }
        return { combatants: newStatus, reel };
    }
    // ------------- type hack starts here

    if (typeMap[newStatus[0].character] === 0 && typeMap[newStatus[1].character] === 2)
        newStatus[0].addEffect(10000000, buffs[buffTypes.armorBonus]);
        
    if (typeMap[newStatus[0].character] === 1 && typeMap[newStatus[1].character] === 0)
        newStatus[0].addEffect(10000000, buffs[buffTypes.armorBonus]);

    if (typeMap[newStatus[0].character] === 2 && typeMap[newStatus[1].character] === 1)
        newStatus[0].addEffect(10000000, buffs[buffTypes.armorBonus]);

    if (typeMap[newStatus[1].character] === 0 && typeMap[newStatus[0].character] === 2)
        newStatus[1].addEffect(10000000, buffs[buffTypes.armorBonus]);

    if (typeMap[newStatus[1].character] === 1 && typeMap[newStatus[0].character] === 0)
        newStatus[1].addEffect(10000000, buffs[buffTypes.armorBonus]);

    if (typeMap[newStatus[1].character] === 2 && typeMap[newStatus[0].character] === 1)
        newStatus[1].addEffect(10000000, buffs[buffTypes.armorBonus]);


    // ---------- end here
    while (newStatus.length >= 2) {
        if (combatants[0].time <= combatants[1].time)
            combatants[0].attack();
        else
            combatants[1].attack();
    }

    newStatus.forEach(s => s.clearBuffs());
    const winner = combatants.filter(c => c.status == newStatus[0])[0];
    winner.time += 2000;
    winner.heal();
    reel.push(...applyFightEvents(newStatus, new FightEvents.LevelUp(
        winner.time,
        0
    )));

    return { combatants: newStatus, reel }
}

const enum types {
    holy,
    magic,
    physical
}

const typeMap = [
    types.physical, // Scullery Maid
    types.physical, // Barkeep
    types.holy,     // Medium
    types.magic,    // Minstrel
    types.magic,    // Mage
    types.physical, // Rogue
    types.holy,     // Warpriest
    types.magic,    // Warlock
    types.physical, // Swashbuckler
    types.magic,    // Dragon
]
