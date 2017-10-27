import { updateBitBoss } from '../front_end/globalDependencies';
import { Combatant } from '../shared/Combatant';
import { Character, Donation, Item, Stats } from './interfaces/interfaces';
import { characterSheets } from './globals/characterSheets';
import { Buff } from './interfaces/buff';
import { Rarity, rarityInfo } from './globals/rarity';

export const atkURLs = [
    'images/icons/fire1.png',
    'images/icons/fire2.png',
    'images/icons/fire3.png'
];

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
    character: number,
    nameMap: {[name: string]: string},
    ...items: Item[]
) : Combatant {
    const pick = characterSheets[character % characterSheets.length];

    let level = rarityInfo[pick.rarity].startingLevel; // 1 indexed

    // while we are not the highest level and we have the bits required to be the next level
    while (level < levels.length && donation.amount > levels[level].bits)
        level++;

    const stats = buildStats(pick, donation.amount, level);

    return new Combatant(
        donation.id,
        donation.name,
        pick,
        donation.amount,
        stats.maxHitPoints,
        level,
        stats,
        donation.bossMessage,
        donation.profileImageURL,
        donation.bossEmoticonURL,
        nameMap[pick.name] || pick.name,
        items
    )
}
