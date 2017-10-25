import { Buff } from './buff';
import { Donation, Source } from './interfaces';
import { Status } from '../Status';

interface abstract_Event {
    time: number;
    type: string;
    targetID: number;
}

export interface Damage extends abstract_Event {
    type: 'damage';
    amount: number;
    source: Source;
}

export interface Dodge extends abstract_Event {
    type: 'dodge';
    source: Source;
}

export interface Death extends abstract_Event {
    type: 'death';
    overkill: number;
    source: Source;
}

export interface Heal extends abstract_Event {
    type: 'heal';
    amount: number;
    source: Source;
}

export interface Crit extends abstract_Event {
    type: 'crit';
    damage: boolean;
    source: Source;
    debuff?: Buff;
    buff?: Buff;
}

export interface LevelUp extends abstract_Event {
    type: 'levelUp';
}

// todo: can now be infered because of sources, remove
export interface Attack extends abstract_Event {
    type: 'attack';
}

export type FightEvent = Damage | Dodge | Death | Heal | Crit | LevelUp | Attack;
