import { FightEvent } from './interfaces/fightEvents';
import { GraphicsEvent } from './interfaces/graphicsEvents';
import { attack, rollAttackSpeed, heal } from './fightActions';
import { Combatant } from '../shared/Combatant';
import { applyFightEvents } from './applyFightEvents';
import { otherCharacter  as other} from './utility';
import { buffs, types as buffTypes } from './interfaces/buff';
import { Source } from './interfaces/source';
import { CombinedEvent } from '../shared/interfaces/interfaces';

/**
 * Plays out a fight between two characters.
 */
export function fight(
    combatant: Combatant[],
    options: { startTime?: number, source?: Source } = {}
) {
    const reel: CombinedEvent[] = [];
    const newCombatant = combatant.map(s => s.clone());
    
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
        if (newCombatant[0].character.attribute === 'holy' && newCombatant[1].character.attribute === 'physical')
            newCombatant[0].addEffect(10000000, buffs.armorBonus);
            
        if (newCombatant[0].character.attribute === 'magic' && newCombatant[1].character.attribute === 'holy')
            newCombatant[0].addEffect(10000000, buffs.armorBonus);

        if (newCombatant[0].character.attribute === 'physical' && newCombatant[1].character.attribute === 'magic')
            newCombatant[0].addEffect(10000000, buffs.armorBonus);

        if (newCombatant[1].character.attribute === 'holy' && newCombatant[0].character.attribute === 'physical')
            newCombatant[1].addEffect(10000000, buffs.armorBonus);

        if (newCombatant[1].character.attribute === 'magic' && newCombatant[0].character.attribute === 'holy')
            newCombatant[1].addEffect(10000000, buffs.armorBonus);

        if (newCombatant[1].character.attribute === 'physical' && newCombatant[0].character.attribute === 'magic')
            newCombatant[1].addEffect(10000000, buffs.armorBonus);
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
