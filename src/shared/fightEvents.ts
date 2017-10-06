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

export abstract class Event {
    constructor (
        public readonly time: number,
        public readonly type: Types,
        public readonly character: number
    ) {};
}

export class Damage extends Event {
    constructor (
        time: number,
        character: number,
        public readonly amount: number
    ) {
        super(time, Types.damage, character);
    }
}

export class Dodge extends Event {
    constructor (
        time: number,
        character: number,
    ) {
        super(time, Types.dodge, character);
    }
}

export class Death extends Event {
    constructor (
        time: number,
        character: number,
    ) {
        super(time, Types.death, character);
    }
}

export class Healing extends Event {
    constructor (
        time: number,
        character: number,
        public readonly amount: number
    ) {
        super(time, Types.healing, character);
    }
}

export class Crit extends Event {
    constructor (
        time: number,
        character: number,
        public readonly debuff?: Buff,
        public readonly buff?: Buff
    ) {
        super(time, Types.crit, character);
    }
}

export class DamageDonation extends Event {
    constructor (
        time: number,
        character: number,
        public readonly donation: Donation,
        public readonly amount: number
    ) {
        super(time, Types.damageDonation, character);
    }
}

export class HealingDonation extends Event {
    constructor (
        time: number,
        character: number,
        public readonly donation: Donation,
        public readonly amount: number
    ) {
        super(time, Types.healingDonation, character);
    }
}


export class LevelUp extends Event {
    constructor (
        time: number,
        character: number
    ) {
        super(time, Types.levelUp, character);
    }
}

export class Attack extends Event {
    constructor (
        time: number,
        character: number
    ) {
        super(time, Types.attack, character);
    }
}
