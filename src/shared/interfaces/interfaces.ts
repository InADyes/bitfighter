import { Buff } from './buff';

/**
 * all information pertaining to a paticular donation
 */
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

/**
 * used to store all information on any paticular item, equipment, or consumable
 */
export interface Item {
    destroy: () => void;
    name: string;
    duration?: number;
    fanInfluencer: string;
    consumable: boolean;
    buffs: Buff[];
}
