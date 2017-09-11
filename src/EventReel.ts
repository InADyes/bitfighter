export const enum EventType {
    Health,
    Attack,
    Clear,
    Power,
    Text,
    Start
} 
export abstract class Event {
    constructor (readonly timeout: number, readonly type: EventType) {};

}

export class HealthUpdate extends Event {
    constructor (
        readonly timeout: number,
        readonly character: number,
        readonly health: number
    ) {
        super(timeout, EventType.Health);
    }
}

export class AttackUpdate extends Event {
    constructor (
        readonly timeout: number,
        readonly character: number,
        readonly attack: number
    ) {
        super(timeout, EventType.Attack);
    }
}

export class ClearUpdate extends Event {
    constructor (
        readonly timeout: number,
        readonly character: number
    ) {
        super(timeout, EventType.Clear);
    }
}

export class PowerUpdate extends Event {
    constructor (
        readonly timeout: number,
        readonly character: number,
        readonly power: number
    ) {
        super(timeout, EventType.Power);
    }
}

export class TextUpdate extends Event {
    constructor (
        readonly timeout: number,
        readonly character: number,
        readonly text: string,
        readonly color: string //should this be a string?
    ) {
        super(timeout, EventType.Text);
    }
}

// needs more finished Combatant Information
export class StartUpdate extends Event {
    constructor (
        readonly timeout: number
    ) {
        super(timeout, EventType.Start);
    }
}
