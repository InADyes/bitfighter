import { BossData } from './gamestate/interfaces';
import { choiceStats } from '../shared/Status';

declare const window: {
    readonly flip: (side: 'front' | 'back') => void,
    // set the game display to bitboss or bitfighter
    readonly receiveCharList: (data: {[details: number]: choiceStats}) => void,
    // set the health of botboss mode diplay
    readonly recalcHp: (damageAmount: number, newHp: number, maxHp: number, attacker: string | null) => void,
    // update the bitboss's name and stuff
    readonly updateBitBoss: (bossData: {boss: BossData, attacker?: BossData})=> void,
    readonly receiveQueue: (data: {
        readonly fanDisplayName: string;
        readonly championTypeName: string;
    }[]) => void
};

export const flip = window.flip;
export const receiveCharList = window.receiveCharList;
export const recalcHp = window.recalcHp;
export const updateBitBoss = window.updateBitBoss;
export const receiveQueue = window.receiveQueue;
