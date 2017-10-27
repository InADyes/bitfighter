/**
 * Each buff is multiplied agaisnt a stat to create a new that is then used.
 * See Combatant for implementation.
 */
export interface Buff {
    readonly duration: number, // milliseconds
    readonly artPath: string,
    readonly name: string,
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

export const buffs: {[name: string]: Buff} = {
    sculleryMaid: {
        duration: 6000,
        artPath: 'images/icons/buffs/mop_up.png',
        name: 'Mop Up',
        accuracy: .5,
        dodge:.5
    },// Scullery Maid - Mop Up
    barkeep: {
        duration: 6000,
        artPath: 'images/icons/buffs/last_call.png',
        name: 'Last Call',
        accuracy: 0.2,
    },// Barkeep - Last Call
    medium: {
        duration: 6000,
        artPath: 'images/icons/buffs/medium_buff.png',
        name: 'Divination',
        accuracy: .75
    },// Medium - Divination
    minstrel: {
        duration: 3000,
        artPath: 'images/icons/buffs/blinding_chord.png',
        name: 'Blinding Chord',
        accuracy: 0,
    },// Minstrel - Blinding Chord
    mage: {
        duration: 6000,
        artPath: 'images/icons/buffs/magic_missile.png',
        name: 'Magic Missile',
        armor: 0,
    },// Mage - Magic Missile
    rogue: {
        duration: 6000,
        artPath: 'images/icons/buffs/backstabbing.png',
        name: 'Evasion',
        dodge: 1.3
    },// Rogue - Evasion
    warpriest: {
        duration: 6000,
        artPath: 'images/icons/buffs/curse.png',
        name: 'Blessing',
        regeneration: 400,
        armor: 2,
    },// Warpriest - Curse
    warlockBuff: {
        duration: 6000,
        artPath: 'images/icons/buffs/damnation_buff.png',
        name: 'Siphon Soul',
        regeneration: 500,
        accuracy: 2,
        dodge: 2,
        critDamageModifier: 4,
    },// Warlock buff - Damnation
    warlockDebuff: {
        duration: 6000,
        artPath: 'images/icons/buffs/damnation_debuff.png',
        name: 'Siphon Soul',
        accuracy: .25,
        dodge: .25,
    },// Warlock Debuff - Damnation
    swashbuckler: {
        duration: 6000,
        artPath: 'images/icons/buffs/whirling_blades.png',
        name: 'Whirling Blades',
        dodge: 1.10,
        accuracy: 1.10
    },// Swashbuckler Buff - Whirling Blades
    dragon: {
        duration: 6000,
        artPath: 'images/icons/buffs/firebreathing.png',
        name: 'Fire Breathing',
        dodge: 0,
    },// Dragon - Fire Breathing
    armorBonus: {
        duration: 10000000,
        artPath: 'no art',
        name: 'Advantage',
        armor: 1.5
    },// ArmorBonus
};
