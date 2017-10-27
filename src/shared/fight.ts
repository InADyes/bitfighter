import { Combatant } from '../shared/Combatant';
import { CombinedEvent } from '../shared/interfaces/interfaces';
import { applyFightEvents } from './applyFightEvents';
import { attack, heal, rollAttackSpeed } from './fightActions';
import { buffs } from './interfaces/buff';
import { FightEvent } from './interfaces/fightEvents';
import { Source } from './interfaces/source';

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

    if (newCombatant.length >= 2) {
        applyAttributeBuffs(newCombatant[0], newCombatant[1]);
        applyAttributeBuffs(newCombatant[1], newCombatant[0]);
    }

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

function applyAttributeBuffs(champ: Combatant, challenger: Combatant) {
    if (champ.character.attribute === 'holy' && challenger.character.attribute === 'physical')
        champ.addEffect(10000000, buffs.armorBonus);
    else if (champ.character.attribute === 'magic' && challenger.character.attribute === 'holy')
        champ.addEffect(10000000, buffs.armorBonus);
    else if (champ.character.attribute === 'physical' && challenger.character.attribute === 'magic')
        champ.addEffect(10000000, buffs.armorBonus);
}
