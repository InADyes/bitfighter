export const enum EventType {
    damage,
    dodge,
    death,
    healing
}

export abstract class Event {
    constructor (
        public readonly timeout: number,
        public readonly type: EventType,
        public readonly character: number
    ) {};
}

export class DamageEvent extends Event {
    constructor (
        timeout: number,
        character: number,
        public readonly amount: number
    ) {
        super(timeout, EventType.damage, character);
    }
}

export class DodgeEvent extends Event {
    constructor (
        timeout: number,
        character: number,
    ) {
        super(timeout, EventType.dodge, character);
    }
}

export class DeathEvent extends Event {
    constructor (
        timeout: number,
        character: number,
    ) {
        super(timeout, EventType.death, character);
    }
}

export class HealingEvent extends Event {
    constructor (
        timeout: number,
        character: number,
        public readonly amount: number
    ) {
        super(timeout, EventType.healing, character);
    }
}
