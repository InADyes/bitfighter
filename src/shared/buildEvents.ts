import { FightEvent } from './interfaces/fightEvents';
import * as FightEvents from './interfaces/fightEvents';
import { GraphicsEvent } from './interfaces/graphicsEvents';
import { attack, rollAttackSpeed, heal } from './fightActions';
import { Combatant } from '../shared/Combatant';
import { applyFightEvents, CombinedEvent } from './applyFightEvents';
import { otherCharacter  as other} from './utility';
import { buffs, types as buffTypes } from './interfaces/buff';
import * as BuildGraphicsEvents from './buildGraphicsEvents';
import { Source } from './interfaces/interfaces';

export function buildEvents(
    combatant: Combatant[],
    options: {startTime?: number, source?: Source} = {}
) {
    const reel: CombinedEvent[] = [];
    const newCombatant = combatant.map(s => s.clone());
    // const combatants = newCombatant.map((combatant, index) => new Combatant(
    //     combatant,
    //     event => reel.push(...applyFightEvents(newCombatant, event)),
    //     attack => {combatants.filter(c => c != attack.attacker)[0].takeHit(attack);},
    //     options.startTime
    // ));
    
    const isFight = newCombatant.length >= 2;
    const newEvent = (event: FightEvent) => reel.push(...applyFightEvents(newCombatant, event));

    for (let c of newCombatant) {
        if (c.hitPoints <= 0) {
            reel.push(...applyFightEvents(newCombatant, {
                type: 'death',
                time: c.time,
                targetID: c.id,
                overkill: -1 * c.hitPoints,
                source: options.source || {type: 'game'}
            }));
        }
    }

    // ------------- type hack starts here
    if (newCombatant.length >= 2) {
        if (typeMap[newCombatant[0].character] === 0 && typeMap[newCombatant[1].character] === 2)
            newCombatant[0].addEffect(10000000, buffs[buffTypes.armorBonus]);
            
        if (typeMap[newCombatant[0].character] === 1 && typeMap[newCombatant[1].character] === 0)
            newCombatant[0].addEffect(10000000, buffs[buffTypes.armorBonus]);

        if (typeMap[newCombatant[0].character] === 2 && typeMap[newCombatant[1].character] === 1)
            newCombatant[0].addEffect(10000000, buffs[buffTypes.armorBonus]);

        if (typeMap[newCombatant[1].character] === 0 && typeMap[newCombatant[0].character] === 2)
            newCombatant[1].addEffect(10000000, buffs[buffTypes.armorBonus]);

        if (typeMap[newCombatant[1].character] === 1 && typeMap[newCombatant[0].character] === 0)
            newCombatant[1].addEffect(10000000, buffs[buffTypes.armorBonus]);

        if (typeMap[newCombatant[1].character] === 2 && typeMap[newCombatant[0].character] === 1)
            newCombatant[1].addEffect(10000000, buffs[buffTypes.armorBonus]);
    }
    // ---------- end here

    // initialize times
    for (let c of newCombatant) {
        c.time = options.startTime || 0;
        rollAttackSpeed(c);
    }

    while (newCombatant.length >= 2) {
        if (newCombatant[0].time <= newCombatant[1].time)
            attack(newCombatant[0], newCombatant[1], newEvent);
        else
            attack(newCombatant[1], newCombatant[0], newEvent);
    }

    newCombatant.forEach(s => s.clearBuffs());
    if (isFight) {
        newCombatant[0].time += 2000;
        heal(
            newCombatant[0],
            {type: 'game'},
            newEvent
        );
        reel.push(...applyFightEvents(newCombatant, {
            type: 'levelUp',
            time: newCombatant[0].time,
            targetID: newCombatant[0].id
        }));
    }

    return { combatants: newCombatant, reel }
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
