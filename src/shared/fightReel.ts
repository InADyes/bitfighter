export const enum EventType {
    damage,
    dodge,
    death,
    healing
}

export abstract class Event {
    constructor (
        public readonly time: number,
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
