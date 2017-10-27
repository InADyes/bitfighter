import { Rarity } from '../globals/rarity';
import { Buff } from './buff';
import { FightEvent } from './fightEvents';
import { GraphicsEvent } from './graphicsEvents';

/**
 * All information pertaining to a paticular donation.
 */
export interface Donation {
    id: string,
    name: string,
    amount: number,
    profileImageURL: string,
    // boss options are used if this fan becomes the bitboss
    bossMessage: string,
    bossEmoticonURL: string,
    bitBossCheerMote: boolean;
}

/**
 * Used to store all information on any paticular item, equipment, or consumable.
 */
export interface Item {
    destroy: () => void;
    name: string;
    duration?: number;
    fanInfluencer: string;
    consumable: boolean;
    buffs: Buff[];
}

/**
 * Multiple graphics events can be generated per fight event.
 */
export interface CombinedEvent {
    fight: FightEvent,
    graphics: GraphicsEvent[]
};
 
export interface Character {
    stats: Readonly<Stats>;
    rarity: Rarity;
    crits: {
        odds: number;
        debuff?: Buff;
        buff?: Buff;
        damageMultiplier?: number;
    }[];
    name: string;
    flavorText: string;
    skillText: string;
    cardStats: {[stat: string]: number};
    // art path needs to be prefixed to become a url
    artPath: string;
    attribute?: 'holy' | 'magic' | 'physical';
    attackGraphicsPath?: string[];
}
 
export interface Stats {
    maxHitPoints: number;
    accuracy: number;
    dodge: number;
    attackSpeed: {
        min: number;
        max: number;
    }; // in milliseconds
    attackDamage: {
        min: number;
        max: number;
    };
    armor: number;
    regeneration: number;
    critChanceModifier: number;
    critDamageModifier: number;
}
