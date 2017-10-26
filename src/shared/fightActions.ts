import { FightEvent } from './interfaces/fightEvents';
import { characters } from './characterPicker';
import { Combatant } from '../shared/Combatant';
import { Source } from '../shared/interfaces/source';

// increase internal timer by attack speed;
export function rollAttackSpeed(target: Combatant) {
    target.time += Math.ceil(Math.random() * (target.stats.attackSpeed.max - target.stats.attackSpeed.min)) + target.stats.attackSpeed.min;
}

export function attack(
    attacker: Combatant,
    attacked: Combatant,
    newEvent: (event: FightEvent) => void
) {
    newEvent({
        type: 'attack',
        time: attacker.time,
        targetID: attacker.id
    });

    attacker.checkBuffs(attacker.time);

    let damageRoll = Math.ceil(Math.random() * (attacker.stats.attackDamage.max - attacker.stats.attackDamage.min)) + attacker.stats.attackDamage.min;

    const total = attacker.stats.accuracy + attacker.stats.dodge;
    const hitChangeRoll = Math.ceil(Math.random() * total);

    if (hitChangeRoll > attacker.stats.accuracy) {
        newEvent({
            type: 'dodge',
            time: attacker.time,
            targetID: attacked.id,
            source: {
                type: 'combatant',
                id: attacker.id
            }
        });
        rollAttackSpeed(attacker);
        return;
    }

    damageRoll -= attacked.stats.armor // applied before crit multipliers

    for (let crit of characters[attacker.character].crits) {
        if (Math.ceil(Math.random() * 100) <= crit.odds * attacker.stats.critChanceModifier) {
            if (crit.damageMultiplier)
                damageRoll = (damageRoll - attacked.stats.armor) * crit.damageMultiplier * attacker.stats.critDamageModifier;
            newEvent({
                type: 'crit',
                time: attacker.time,
                targetID: attacked.id,
                damage: crit.damageMultiplier !== undefined,
                buff: crit.buff,
                debuff: crit.debuff,
                source: {
                    type: 'combatant',
                    id: attacker.id
                }
            });
        }
    }

    if (damageRoll < 0)
        damageRoll = 0;

    newEvent({
        type: 'damage',
        time: attacker.time,
        targetID: attacked.id,
        amount: damageRoll,
        source: {
            type: 'combatant',
            id: attacker.id
        }
    });
        
    if (attacked.hitPoints <= 0) {
        newEvent({
            type: 'death',
            time: attacker.time,
            targetID: attacked.id,
            source: {
                type: 'combatant',
                id: attacker.id
            },
            overkill: -1 * attacked.hitPoints
        });
    }
    rollAttackSpeed(attacker);
}

export function heal(
    target: Combatant,
    source: Source,
    newEvent: (event: FightEvent) => void
) {
    target.checkBuffs(target.time);
    const maxHitPoints = target.stats.maxHitPoints;
    let healingAmount = target.stats.regeneration;

    if (healingAmount + target.hitPoints > maxHitPoints)
        healingAmount = maxHitPoints - target.hitPoints;

    // allways heals the first character in the future, needs to be changed
    newEvent({
        type: 'heal',
        time: target.time + 200,
        targetID: target.id,
        amount: healingAmount,
        source: source
    });
}
