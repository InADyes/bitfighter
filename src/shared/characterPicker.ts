import { Combatant } from '../shared/Combatant';
import { rarityInfo } from './globals/rarity';
import { Character, Donation, Item, Stats } from './interfaces/interfaces';

interface Level {
    //level: number;
    readonly bits: number;
    readonly damage: number;
    readonly health: number;
};

export const levels: Level[] = [
    {
        bits: 1,
        damage: 0,
        health: 0,
    },// level 1
];

export function buildStats(character: Character, donation: number, level: number) : Stats {
    const c = character;

    return {
        maxHitPoints: c.stats.maxHitPoints + (donation < 2000 ? donation / 4 : 500 + (donation - 2000) / 16),
        accuracy: c.stats.accuracy,
        dodge: c.stats.dodge,
        attackSpeed: {
            min: c.stats.attackSpeed.min,
            max: c.stats.attackSpeed.max
        },
        attackDamage: {
            min: c.stats.attackDamage.min,
            max: c.stats.attackDamage.max
        },
        armor: c.stats.armor,
        regeneration: c.stats.regeneration,
        critChanceModifier: c.stats.critChanceModifier,
        critDamageModifier: c.stats.critDamageModifier
    }
}

/**
 * Given the right ingredients builds a combatant.
 * 
 * donation.amount is assumed to be in bits.
 */
export function pickCharacter(
    donation: Donation,
    character: Character,
    ...items: Item[]
) : Combatant {

    let level = rarityInfo[character.rarity].startingLevel; // 1 indexed

    // while we are not the highest level and we have the bits required to be the next level
    while (level < levels.length && donation.amount > levels[level].bits)
        level++;

    const stats = buildStats(character, donation.amount, level);

    return new Combatant(
        donation.id,
        donation.name,
        character,
        donation.amount,
        stats.maxHitPoints,
        level,
        stats,
        donation.bossMessage,
        donation.profileImageURL,
        donation.bossEmoticonURL,
        character.name,
        items
    )
}
