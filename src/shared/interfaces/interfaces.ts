import { FightEvent } from './fightEvents';
import { Combatant } from '../Combatant';

export interface Donation {
    id: number,
    name: string,
    amount: number,
    profileImageURL: string,
    // boss options are used if this fan becomes the bitboss
    bossMessage: string,
    bossEmoticonURL: string,
    bitBossCheerMote: boolean;
}

interface a_Source {
    type: string;
}

interface CombatantSource extends a_Source {
    readonly type: 'combatant';
    readonly id: number;
}

interface DonationSource extends a_Source {
    readonly type: 'donation';
    readonly donation: Donation;
}

interface EventSource extends a_Source {
    readonly type: 'event';
    readonly event: FightEvent;
}

interface GameSource extends a_Source {
    readonly type: 'game';
}

export type Source = CombatantSource | DonationSource | EventSource | GameSource;
