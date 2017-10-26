import { Buff } from './buff';
import { Donation } from './interfaces';
import { Combatant } from '../Combatant';
import { Source } from './source';

interface abstract_Event {
    time: number;
    type: string;
    targetID: string;
}

interface Damage extends abstract_Event {
    type: 'damage';
    amount: number;
    source: Source;
}

interface Dodge extends abstract_Event {
    type: 'dodge';
    source: Source;
}

interface Death extends abstract_Event {
    type: 'death';
    overkill: number;
    source: Source;
}

interface Heal extends abstract_Event {
    type: 'heal';
    amount: number;
    source: Source;
}

interface Crit extends abstract_Event {
    type: 'crit';
    damage: boolean;
    source: Source;
    debuff?: Buff;
    buff?: Buff;
}

interface LevelUp extends abstract_Event {
    type: 'levelUp';
}

// todo: can now be infered because of sources, remove
interface Attack extends abstract_Event {
    type: 'attack';
}

/**
 * Fight events are all actions that happen in a fight. An array of these should be sufficient to re-create a fight.
 */
export type FightEvent = Damage | Dodge | Death | Heal | Crit | LevelUp | Attack;
