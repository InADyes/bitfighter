import { Combatant } from './Combatant';
import { Buff } from './interfaces/buff';
import { Donation, Source } from './interfaces/interfaces';

interface abstract_Event {
    time: number;
    type: string;
    character: number;
}

export interface Damage extends abstract_Event {
    type: 'damage';
    time: number;
    character: number;
    amount: number;
    source: Source;
}

export interface Dodge extends abstract_Event {
    type: 'dodge';
    time: number;
    character: number;
    source: Source;
}

export interface Death extends abstract_Event {
    type: 'death';
    time: number;
    character: number;
    overkill: number;
    source: Source;
}

export interface Heal extends abstract_Event {
    type: 'heal';
    time: number;
    character: number;
    amount: number;
    source: Source;
}

export interface Crit extends abstract_Event {
    type: 'crit';
    time: number;
    character: number;
    damage: boolean;
    source: Source;
    debuff?: Buff;
    buff?: Buff
}

export interface LevelUp extends abstract_Event {
    type: 'levelUp';
    time: number;
    character: number
}

// todo: can now be infered because of sources, remove
export interface Attack extends abstract_Event {
    type: 'attack';
    time: number;
    character: number
}

export type FightEvent = Damage | Dodge | Death | Heal | Crit | LevelUp | Attack;
