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
    { // 1-1
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 10, scaler: 1},
        attackSpeed: {base: 1300, scaler: 0},
        attackDamage: {base: 100, scaler: 0},
        armor: {base: 40, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/stickfighter-swordman.png'
    },
    { // 1-2
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 5, scaler: 1},
        attackSpeed: {base: 1750, scaler: 0},
        attackDamage: {base: 150, scaler: 0},
        armor: {base: 45, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/stickfighter-mage.png'
    },
    { // 1-3
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 0, scaler: 1},
        attackSpeed: {base: 2250, scaler: 0},
        attackDamage: {base: 185, scaler: 0},
        armor: {base: 60, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/stickfighter-farmer.png'
    },
    { // 2-1
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 10, scaler: 1},
        attackSpeed: {base: 1300, scaler: 0},
        attackDamage: {base: 100, scaler: 0},
        armor: {base: 40, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/comic-StreetUrchin.png'
    },
    { // 2-2
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 5, scaler: 1},
        attackSpeed: {base: 1750, scaler: 0},
        attackDamage: {base: 150, scaler: 0},
        armor: {base: 45, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/comic-Minstrel.png'
    },
    { // 2-3
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 0, scaler: 1},
        attackSpeed: {base: 2250, scaler: 0},
        attackDamage: {base: 185, scaler: 0},
        armor: {base: 60, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/comic-farmer.png'
    },
    { // 3-1
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 10, scaler: 1},
        attackSpeed: {base: 1300, scaler: 0},
        attackDamage: {base: 100, scaler: 0},
        armor: {base: 40, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/silhouettes-rogue.png'
    },
    { // 3-2
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 5, scaler: 1},
        attackSpeed: {base: 1750, scaler: 0},
        attackDamage: {base: 150, scaler: 0},
        armor: {base: 45, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/silhouettes-rogue.png'
    },
    { // 3-3
        hitPoints: {base: 1000, scaler: 0},
        accuracy: {base: 0, scaler: 1},
        dodge: {base: 0, scaler: 1},
        attackSpeed: {base: 2250, scaler: 0},
        attackDamage: {base: 185, scaler: 0},
        armor: {base: 60, scaler: 0},
        regeneration: {base: 0.2, scaler: 0},
        spriteUrl: 'images/characters/silhouettes-farmer.png'
    }
];


// i'm going to fix this i swear
export function pickCharacter(donation: {id: number, name: string, amount: number, style: number, art: number}) {
    let character = characters[((donation.style-1)*3+donation.art-1) % characters.length];
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
