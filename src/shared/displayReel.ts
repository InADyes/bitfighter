export const enum EventType {
    Health,
    Attack,
    Clear,
    Text
}

export class Event {
    constructor (
        readonly time: number,
        readonly type: EventType,
        readonly character: number
    ) {}
}

export class HealthUpdate extends Event {
    constructor (
        time: number,
        character: number,
        readonly health: number
    ) {
        super(time, EventType.Health, character);
    }
}

export class AttackUpdate extends Event {
    constructor (
        time: number,
        character: number
    ) {
        super(time, EventType.Attack, character);
    }
}

export class ClearUpdate extends Event {
    constructor (
        time: number,
        character: number
    ) {
        super(time, EventType.Clear, character);
    }
}

export class TextUpdate extends Event {
    constructor (
        time: number,
        character: number,
        readonly text: string,
        readonly color: string //should this be a string?
    ) {
        super(time, EventType.Text, character);
    }
}
