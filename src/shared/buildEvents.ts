import * as FightEvents from './interfaces/fightEvents';
import { GraphicsEvent } from './interfaces/graphicsEvents';
import { Combatant } from './Combatant';
import { Status } from '../shared/Status';
import { applyFightEvents, CombinedEvent } from './applyFightEvents';
import { otherCharacter  as other} from './utility';
import { buffs, types as buffTypes } from './interfaces/buff';
import * as BuildGraphicsEvents from './buildGraphicsEvents';
import { Source } from './interfaces/interfaces';

export function buildEvents(
    status: Status[],
    options: {startTime?: number, source?: Source} = {source: undefined}
) {
    const reel: CombinedEvent[] = [];
    const newStatus = status.map(s => s.clone());
    const combatants = newStatus.map((status, index) => new Combatant(
        status,
        event => reel.push(...applyFightEvents(newStatus, event)),
        attack => {combatants.filter(c => c != attack.attacker)[0].takeHit(attack);},
        options.startTime
    ));
    
    const isFight = newStatus.length >= 2;

    for (let c of combatants) {
        if (c.status.hitPoints <= 0) {
            // reel.push(...applyFightEvents(newStatus, new FightEvents.Death(
            //     combatants[i].time,
            //     i,
            //     -1 * combatants[i].status.hitPoints
            // )));
            reel.push(...applyFightEvents(newStatus, {
                type: 'death',
                time: c.time,
                targetID: c.status.id,
                overkill: -1 * c.status.hitPoints,
                source: options.source || {type: 'game'}
            }));
        }
    }

    // ------------- type hack starts here
    if (newStatus.length >= 2) {
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
    }

    // ---------- end here
    while (newStatus.length >= 2) {
        if (combatants[0].time <= combatants[1].time)
            combatants[0].attack();
        else
            combatants[1].attack();
    }

    newStatus.forEach(s => s.clearBuffs());
    if (isFight) {
        const winner = combatants.filter(c => c.status === newStatus[0])[0];
        winner.time += 2000;
        winner.heal({type: 'game'});
        // reel.push(...applyFightEvents(newStatus, new FightEvents.LevelUp(
        //     winner.time,
        //     0
        // )));
        reel.push(...applyFightEvents(newStatus, {
            type: 'levelUp',
            time: winner.time,
            targetID: newStatus[0].id
        }));
    }

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
];
