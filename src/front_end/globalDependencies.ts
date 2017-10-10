import { BossData } from './gamestate/interfaces';

declare const window: {
    readonly flip: (side: 'front' | 'back') => void,
    // set the game display to bitboss or bitfighter
    readonly receiveCharList: (data: any) => void,
    // set the health of botboss mode diplay
    readonly recalcHp: (damageAmount: number, newHp: number, maxHp: number, attacker: string | null) => void,
    // update the bitboss's name and stuff
    readonly updateBitBoss: (bossData: {boss: BossData, attacker?: BossData})=> void,
    readonly receiveQueue: (data: any) => void
};

export const flip = window.flip;
export const receiveCharList = window.receiveCharList;
export const recalcHp = window.recalcHp;
export const updateBitBoss = window.updateBitBoss;
export const receiveQueue = window.receiveQueue;
