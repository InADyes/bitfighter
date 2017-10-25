import { FightEvent } from './interfaces/fightEvents';
import * as FightEvents from './interfaces/fightEvents';
import { GraphicsEvent } from './interfaces/graphicsEvents';
import { attack, rollAttackSpeed, heal } from './fightActions';
import { Status } from '../shared/Status';
import { applyFightEvents, CombinedEvent } from './applyFightEvents';
import { otherCharacter  as other} from './utility';
import { buffs, types as buffTypes } from './interfaces/buff';
import * as BuildGraphicsEvents from './buildGraphicsEvents';
import { Source } from './interfaces/interfaces';

export function buildEvents(
    status: Status[],
    options: {startTime?: number, source?: Source} = {}
) {
    const reel: CombinedEvent[] = [];
    const newStatus = status.map(s => s.clone());
    // const combatants = newStatus.map((status, index) => new Combatant(
    //     status,
    //     event => reel.push(...applyFightEvents(newStatus, event)),
    //     attack => {combatants.filter(c => c != attack.attacker)[0].takeHit(attack);},
    //     options.startTime
    // ));
    
    const isFight = newStatus.length >= 2;
    const newEvent = (event: FightEvent) => reel.push(...applyFightEvents(newStatus, event));

    for (let c of newStatus) {
        if (c.hitPoints <= 0) {
            reel.push(...applyFightEvents(newStatus, {
                type: 'death',
                time: c.time,
                targetID: c.id,
                overkill: -1 * c.hitPoints,
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

    // initialize times
    for (let c of newStatus) {
        c.time = options.startTime || 0;
        rollAttackSpeed(c);
    }

    while (newStatus.length >= 2) {
        if (newStatus[0].time <= newStatus[1].time)
            attack(newStatus[0], newStatus[1], newEvent);
        else
            attack(newStatus[1], newStatus[0], newEvent);
    }

    newStatus.forEach(s => s.clearBuffs());
    if (isFight) {
        newStatus[0].time += 2000;
        heal(
            newStatus[0],
            {type: 'game'},
            newEvent
        );
        reel.push(...applyFightEvents(newStatus, {
            type: 'levelUp',
            time: newStatus[0].time,
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
