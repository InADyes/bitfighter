import { Buff } from './buff';

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

export interface Item {
    destroy: () => void;
    name: string;
    duration?: number;
    fanInfluencer: string;
    consumable: boolean;
    buffs: Buff[];
}
