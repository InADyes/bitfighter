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
    { // sword1
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 10, scaler: 1},
        attackSpeed: {base: 1300, scaler: 0},
        attackDamage: {base: 100, scaler: 0},
        armor: {base: 40, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/sword.png'
    },
    { // daggers1
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 5, scaler: 1},
        attackSpeed: {base: 1750, scaler: 0},
        attackDamage: {base: 150, scaler: 0},
        armor: {base: 45, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/123.png'
    },
    { // big axe1
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 0, scaler: 1},
        attackSpeed: {base: 2250, scaler: 0},
        attackDamage: {base: 185, scaler: 0},
        armor: {base: 60, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/axe1.png'
    },
    { // sword2
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 10, scaler: 1},
        attackSpeed: {base: 1300, scaler: 0},
        attackDamage: {base: 100, scaler: 0},
        armor: {base: 40, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/sword.png'
    },
    { // daggers2
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 5, scaler: 1},
        attackSpeed: {base: 1750, scaler: 0},
        attackDamage: {base: 150, scaler: 0},
        armor: {base: 45, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/123.png'
    },
    { // big axe2
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 0, scaler: 1},
        attackSpeed: {base: 2250, scaler: 0},
        attackDamage: {base: 185, scaler: 0},
        armor: {base: 60, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/axe1.png'
    },
    { // sword3
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 10, scaler: 1},
        attackSpeed: {base: 1300, scaler: 0},
        attackDamage: {base: 100, scaler: 0},
        armor: {base: 40, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/sword.png'
    },
    { // daggers3
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 5, scaler: 1},
        attackSpeed: {base: 1750, scaler: 0},
        attackDamage: {base: 150, scaler: 0},
        armor: {base: 45, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/123.png'
    },
    { // big axe3
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 0, scaler: 1},
        attackSpeed: {base: 2250, scaler: 0},
        attackDamage: {base: 185, scaler: 0},
        armor: {base: 60, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/axe1.png'
    }
];


// i'm going to fix this i swear
export function pickCharacter(donation: {id: number, name: string, amount: number, style: number, art: number}) {
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
