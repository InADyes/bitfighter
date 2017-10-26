import { FightEvent } from './fightEvents';
import { Combatant } from '../Combatant';
import { Donation } from './interfaces';

interface a_Source {
    type: string;
}

interface CombatantSource extends a_Source {
    readonly type: 'combatant';
    readonly id: string;
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