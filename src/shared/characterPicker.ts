import { updateBitBoss } from '../front_end/globalDependencies';
import { Combatant } from '../shared/Combatant';
import { Donation, Item, Stats } from './interfaces/interfaces';
import { characterSheets } from './globals/characterSheets';
import { Buff } from './interfaces/buff';
import { Rarity, rarityInfo } from './globals/rarity';

export const artURLs = [
    "images/champions/0scullery_maid.png",
    "images/champions/1barkeep.png",
    "images/champions/2medium.png",
    "images/champions/3minstrel.png",        
    "images/champions/4mage.png", 
    "images/champions/5rogue.png",
    "images/champions/6warpriest.png",
    "images/champions/7warlock.png",  
    "images/champions/8swashbuckler.png",    
    "images/champions/9dragon.png",
    "images/champions/10grave_digger.png",
    "images/champions/10grave_digger.png"
];

export const buffURLs = [
    "images/icons/buffs/mop_up.png",
    "images/icons/buffs/last_call.png",
    "images/icons/buffs/medium_buff.png",
    "images/icons/buffs/blinding_chord.png",
    "images/icons/buffs/magic_missile.png",
    "images/icons/buffs/backstabbing.png",
    "images/icons/buffs/curse.png",
    "images/icons/buffs/damnation_buff.png",
    "images/icons/buffs/damnation_debuff.png",
    "images/icons/buffs/whirling_blades.png",
    "images/icons/buffs/firebreathing.png"
];

export const atkURLs = [
    "images/icons/fire1.png",
    "images/icons/fire2.png",
    "images/icons/fire3.png"
];

export const enum characterTypes {
    sculleryMaid    = 0,
    barkeep         = 1,
    medium          = 2,
    minstrel        = 3,
    mage            = 4,
    rogue           = 5,
    warpriest       = 6,
    warlock         = 7,
    swashbuckler    = 8,
    dragon          = 9,
    graveDigger     = 10,
    bitBoss         = 11
};

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

export function buildStats(character: number, donation: number, level: number) : Stats {
    const c = characterSheets[character];

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
    const pick = character % characterSheets.length;

    let level = rarityInfo[characterSheets[pick].rarity].startingLevel; // 1 indexed

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
        nameMap[characterSheets[pick].name] || characterSheets[pick].name,
        items
    )
}
