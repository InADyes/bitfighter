import { FightEvent } from './interfaces/fightEvents';
import { characters } from './characterPicker';
import { Status } from '../shared/Status';
import { Source } from '../shared/interfaces/interfaces';

// interface attackProps {
//     source: Source;
//     time: number;
//     attacker: Combatant;
//     damage: number;
//     accuracy: number;
//     critChanceModifier: number;
//     critDamageModifier: number;
//     crits: {
//         odds: number;
//         debuff?: Buff.Buff;
//         buff?: Buff.Buff;
//         damageMultiplier?: number;
//     }[];
// }

// export class Combatant {
//     constructor(
//         public readonly status: Status,
//         private readonly newEvent: (event: FightEvent) => void,
//         private readonly attackCallback: (attack: attackProps) => void,
//         public time: number = 0
//     ) {
//         this.rollAttackSpeed();
//     }

// increase internal timer by attack speed;
export function rollAttackSpeed(target: Status) {
    target.time += Math.ceil(Math.random() * (target.stats.attackSpeed.max - target.stats.attackSpeed.min)) + target.stats.attackSpeed.min;
}

export function attack(
    attacker: Status,
    attacked: Status,
    newEvent: (event: FightEvent) => void
) {
    newEvent({
        type: 'attack',
        time: attacker.time,
        targetID: attacker.id
    });

    attacker.checkBuffs(attacker.time);

    let damageRoll = Math.ceil(Math.random() * (attacker.stats.attackDamage.max - attacker.stats.attackDamage.min)) + attacker.stats.attackDamage.min;

    // this.attackCallback({
    //     source: {
    //         type: 'combatant',
    //         id: this.status.id
    //     },
    //     time: this.time,
    //     attacker: this,
    //     damage: damageRoll,
    //     accuracy: stats.accuracy,
    //     critDamageModifier: stats.critDamageModifier,
    //     critChanceModifier: stats.critChanceModifier,
    //     crits: characterPicker.characters[this.status.character].crits
    // });
    
    rollAttackSpeed(attacker);

    const total = attacker.stats.accuracy + attacker.stats.dodge;
    const hitChangeRoll = Math.ceil(Math.random() * total);

    if (hitChangeRoll > attacker.stats.accuracy) {
        newEvent({
            type: 'dodge',
            time: attacker.time,
            targetID: attacker.id,
            source: {
                type: 'combatant',
                id: attacker.id
            }
        });
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
    // else if (damageRoll > this.status.hitPoints)
    //     damageRoll = this.status.hitPoints;

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

}

export function heal(
    target: Status,
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
