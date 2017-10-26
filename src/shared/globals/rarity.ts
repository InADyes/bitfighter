export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic' | 'graveDigger' | 'bitBoss';

export const rarityInfo: {
    readonly [K in Rarity]: {
        readonly name: string;
        readonly color: string;
        readonly startingLevel: number;
    }
} = {
    'common': {
        name: 'Common',
        color: 'white',
        startingLevel: 1
    },
    'uncommon': {
        name: 'Uncommon',
        color: 'grey',
        startingLevel: 3
    },
    'rare': {
        name: 'Rare',
        color: 'blue',
        startingLevel: 5
    },
    'mythic': {
        name: 'Mythic',
        color: 'orange',
        startingLevel: 7
    },
    'graveDigger': {
        name: 'Grave Digger',
        color: 'green',
        startingLevel: 0
    },
    'bitBoss': {
        name: 'BitBoss',
        color: 'purple',
        startingLevel: 0
    }
};

export const rarities = Object.keys(rarityInfo) as Rarity[];
