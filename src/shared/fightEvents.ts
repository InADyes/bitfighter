import * as Buff from './interfaces/buff';

export const enum Types {
    damage,
    dodge,
    death,
    healing,
    crit,
    donation,
    levelUp,
    attack
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
        public readonly debuff?: Buff.Buff,
        public readonly buff?: Buff.Buff
    ) {
        super(time, Types.crit, character);
    }
}

export class Donation extends Event {
    constructor (
        time: number,
        character: number,
        public readonly donationType: DonationType
    ) {
        super(time, Types.donation, character);
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

export const enum DonationType {
    healing,
    damage
}
