import { Combatant } from '../shared/Combatant';
import { Donation, Character } from '../shared/interfaces/interfaces';

/**
 * Template for a BitBoss.
 */
export function generateBitBoss(donation: Donation, characterSheets: Character[], health: number) : Combatant {
    if (health < 1)
        health = 1;

    return new Combatant(
        donation.id,
        donation.name,
        characterSheets[11],
        donation.amount,
        health,
        0,
        { 
            maxHitPoints: health,
            accuracy: 0,
            dodge: 0,
            attackSpeed: {
                min: 0,
                max: 0
            },
            attackDamage: {
                min: 0,
                max: 0
            },
            armor: 0,
            regeneration: 0,
            critChanceModifier: 0,
            critDamageModifier: 0
        },
        donation.bossMessage,
        donation.profileImageURL,
        donation.bossEmoticonURL,
        '',
        []
    )
}
