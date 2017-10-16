import { Donation } from '../shared/interfaces/donation';
import { Status } from '../shared/Status';
import { characterTypes } from '../shared/characterPicker';

export function generateBitBoss(donation: Donation, health: number) : Status {
    if (health < 1)
        health = 1;

    return new Status(
        donation.id,
        donation.name,
        characterTypes.bitBoss,
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
        donation.profileImageURL,
        donation.bossMessage,
        donation.bossEmoticonURL,
        ''
    )
}