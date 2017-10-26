import { SSL_OP_COOKIE_EXCHANGE } from 'constants';
import { ReelMessage } from './backToFrontMessage';

/**
 * Each buff is multiplied agaisnt a stat to create a new that is then used.
 * See Combatant for implementation.
 */
export interface Buff {
    readonly duration: number, // milliseconds
    readonly art: number,
    readonly name: string,
    readonly url: string,
    readonly accuracy?: number,
    readonly dodge?: number,
    readonly attackSpeed?: number, // doesn't work very well right now
    readonly attackDamage?: number,
    readonly armor?: number,
    readonly regeneration?: number,
    readonly critChanceModifier?: number
    readonly critDamageModifier?: number
}

export const enum types {
    sculleryMaid            = 0,
    barkeep                 = 1,
    medium                  = 2,
    minstrel                = 3,
    mage                    = 4,
    rogue                   = 5,
    warpriest               = 6,
    warlockBuff             = 7,
    warlockDebuff           = 8,
    swashbucklerBuff        = 9,
    dragon                  = 10,
    armorBonus              = 11,
}

export const buffs: Buff[] = [
    {
        duration: 6000,
        art: 0,
        name: 'Mop Up',
        url: "images/icons/buffs/mop_up.png",
        accuracy: .5,
        dodge:.5
    },// Scullery Maid - Mop Up
    {
        duration: 6000,
        art: 1,
        name: 'Last Call',
        url: "images/icons/buffs/last_call.png",
        accuracy: 0.2,
    },// Barkeep - Last Call
    {
        duration: 6000,
        art: 2,
        name: 'Divination',
        url: "images/icons/buffs/medium_buff.png",
        accuracy: .75
    },// Medium - Divination
    {
        duration: 3000,
        art: 3,
        name: 'Blinding Chord',
        url: "images/icons/buffs/blinding_chord.png",
        accuracy: 0,
    },// Minstrel - Blinding Chord
    {
        duration: 6000,
        art: 4,
        name: 'Magic Missile',
        url: "images/icons/buffs/magic_missile.png",
        armor: 0,
    },// Mage - Magic Missile
    {
        duration: 6000,
        art: 5,
        name: 'Evasion',
        url: "images/icons/buffs/backstabbing.png",
        dodge: 1.3
    },// Rogue - Evasion
    {
        duration: 6000,
        art: 6,
        name: 'Blessing',
        url: "images/icons/buffs/curse.png",
        regeneration: 400,
        armor: 2,
    },// Warpriest - Curse
    {
        duration: 6000,
        art: 7,
        name: 'Siphon Soul',
        url: "images/icons/buffs/damnation_buff.png",
        regeneration: 500,
        accuracy: 2,
        dodge: 2,
        critDamageModifier: 4,
    },// Warlock buff - Damnation
    {
        duration: 6000,
        art: 8,
        name: 'Siphon Soul',
        url: "images/icons/buffs/damnation_debuff.png",
        accuracy: .25,
        dodge: .25,
    },// Warlock Debuff - Damnation
    {
        duration: 6000,
        art: 9,
        name: 'Whirling Blades',
        url: "images/icons/buffs/whirling_blades.png",
        dodge: 1.10,
        accuracy: 1.10
    },// Swashbuckler Buff - Whirling Blades
    {
        duration: 6000,
        art: 10,
        name: 'Fire Breathing',
        url: "images/icons/buffs/firebreathing.png",
        dodge: 0,
    },// Dragon - Fire Breathing
    {
        duration: 10000000,
        art: 22,
        name: 'Advantage',
        url: 'no art',
        armor: 1.5
    },// ArmorBonus
];
