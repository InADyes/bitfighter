import { BossData } from './gamestate/interfaces';
import { choiceStats } from '../shared/Status';
import { CharacterListItem } from '../shared/interfaces/backToFrontMessage';

declare const window: {
    readonly flip: (side: 'front' | 'back') => void,
    // set the game display to bitboss or bitfighter
    readonly receiveCharList: (charList: CharacterListItem[]) => void,
    // set the health of botboss mode diplay
    readonly recalcHp: (damageAmount: number, newHp: number, maxHp: number, attacker: string | null) => void,
    // update the bitboss's name and stuff
    readonly updateBitBoss: (bossData: {boss: BossData, attacker?: BossData})=> void,
    readonly receiveQueue: (data: {
        readonly fanDisplayName: string;
        readonly championTypeName: string;
    }[]) => void,
    readonly bossMessageTooManyChanges: () => void
};

const keys: (keyof typeof window)[] = ['flip', 'receiveCharList', 'recalcHp', 'updateBitBoss', 'receiveQueue', 'bossMessageTooManyChanges'];

for (let key of keys) {
    if (typeof window[key] !== 'function' )
        console.error('missing global function:', key);
}

export const flip = window.flip;
export const receiveCharList = window.receiveCharList;
export const recalcHp = window.recalcHp;
export const updateBitBoss = window.updateBitBoss;
export const receiveQueue = window.receiveQueue;
export const bossMessageTooManyChanges = window.bossMessageTooManyChanges;
