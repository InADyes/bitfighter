import * as Buff from './buff';

export const enum EventType {
    damage,
    dodge,
    death,
    healing,
    crit,
    donation
}

export abstract class Event {
    constructor (
        public time: number,
        public readonly type: EventType,
        public readonly character: number
    ) {};
}

export class DamageEvent extends Event {
    constructor (
        time: number,
        character: number,
        public readonly amount: number
    ) {
        super(time, EventType.damage, character);
    }
}

export class DodgeEvent extends Event {
    constructor (
        time: number,
        character: number,
    ) {
        super(time, EventType.dodge, character);
    }
}

export class DeathEvent extends Event {
    constructor (
        time: number,
        character: number,
    ) {
        super(time, EventType.death, character);
    }
}

export class HealingEvent extends Event {
    constructor (
        time: number,
        character: number,
        public readonly amount: number
    ) {
        super(time, EventType.healing, character);
    }
}

export class CritEvent extends Event {
    constructor (
        time: number,
        character: number,
        public readonly debuff?: Buff.Buff,
        public readonly buff?: Buff.Buff
    ) {
        super(time, EventType.crit, character);
    }
}

export class DonationEvent extends Event {
    constructor (
        time: number,
        character: number,
        public readonly donationType: DonationType
    ) {
        super(time, EventType.donation, character);
    }
}

export const enum DonationType {
    healing,
    damage
}
