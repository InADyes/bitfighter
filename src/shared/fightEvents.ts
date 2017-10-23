import { Buff } from './interfaces/buff';
import { Donation } from './interfaces/donation';

export const enum Types {
    damage,
    dodge,
    death,
    healing,
    crit,
    damageDonation,
    levelUp,
    attack,
    healingDonation
}

export interface Event {
    time: number;
    type: Types;
    character: number;
}

export class Damage implements Event {
    public type = Types.damage;
    constructor (
        public time: number,
        public character: number,
        public amount: number
    ) {}
}

export class Dodge implements Event {
    public type = Types.dodge;
    constructor (
        public time: number,
        public character: number
    ) {}
}

export class Death implements Event {
    public type = Types.death;
    constructor (
        public time: number,
        public character: number,
        public overkill: number
    ) {}
}

export class Healing implements Event {
    public type = Types.healing;
    constructor (
        public time: number,
        public character: number,
        public amount: number
    ) {}
}

export class Crit implements Event {
    public type = Types.crit;
    constructor (
        public time: number,
        public character: number,
        public damage: boolean,
        public debuff?: Buff,
        public buff?: Buff
    ) {}
}

export class DamageDonation implements Event {
    public type = Types.damageDonation;
    constructor (
        public time: number,
        public character: number,
        public donation: Donation,
        public amount: number
    ) {}
}

export class HealingDonation implements Event {
    public type = Types.healingDonation;
    constructor (
        public time: number,
        public character: number,
        public donation: Donation,
        public amount: number
    ) {}
}


export class LevelUp implements Event {
    public type = Types.levelUp;
    constructor (
        public time: number,
        public character: number
    ) {}
}

export class Attack implements Event {
    public type = Types.attack;
    constructor (
        public time: number,
        public character: number
    ) {}
}
