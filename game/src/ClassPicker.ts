
/// <reference path='Combatant.ts' />

namespace ClassPicker {
    
let spriteArt = [
    'images/animation/champion_alpha.png',
    'images/animation/Axe/Axe.png',
    'images/animation/Katana/Katana.png',
    'images/animation/Orc/Orc.png',
    'images/animation/Wizard/Wizard.png'
];

let iconArt = [
    'images/icons/cherries.png',
    'images/icons/banana.png',
    'images/icons/lime-icon.png',
    'images/icons/orange-icon.png'
];

interface Stat {
    base: number;
    scaler: number;
};

interface Character {
    hitPoints: Stat,
    accuracy: Stat,
    dodge: Stat,
    attackSpeed: Stat,
    attackDamage: Stat,
    armor: Stat,
    regeneration: Stat,
    spriteUrl: string
};

// still thinking about this
let characters: Character[] = [
    {
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 0, scaler: 1},
        attackSpeed: {base: 2000, scaler: 0},
        attackDamage: {base: 125, scaler: 0},
        armor: {base: 25, scaler: 0},
        regeneration: {base: 200, scaler: 0},
        spriteUrl: 'images/animation/champion_alpha.png'
    }
];


// i'm going to fix this i swear
export function pickCharacter(donation: {id: number, name: string, amount: number, art: number}) {
    let character = characters[donation.art % characters.length];
    return {
        stats: {
            hitPoints: character.hitPoints.base + character.hitPoints.scaler * donation.amount,
            accuracy: character.accuracy.base + character.accuracy.scaler * donation.amount,
            dodge: character.dodge.base + character.dodge.scaler * donation.amount,
            attackSpeed: character.attackSpeed.base + character.attackSpeed.scaler * donation.amount,
            attackDamage: character.attackDamage.base + character.attackDamage.scaler * donation.amount,
            armor: character.armor.base + character.armor.scaler * donation.amount,
            regeneration: character.regeneration.base + character.regeneration.scaler * donation.amount
        },
        spriteUrl: character.spriteUrl
    }
}

}
