export const enum EventType {
    Health,
    Attack, // animation only
    Clear,
    Text,
    Buff
}

export class Event {
    constructor (
        readonly time: number,
        readonly type: EventType,
        readonly character: number
    ) {}
}

export class Health extends Event {
    constructor (
        time: number,
        character: number,
        readonly health: number // delta
    ) {
        super(time, EventType.Health, character);
    }
}

export class Attack extends Event {
    constructor (
        time: number,
        character: number
    ) {
        super(time, EventType.Attack, character);
    }
}

export class Clear extends Event {
    constructor (
        time: number,
        character: number
    ) {
        super(time, EventType.Clear, character);
    }
}

export class Text extends Event {
    constructor (
        time: number,
        character: number,
        readonly text: string,
        readonly color: string //should this be a string?
    ) {
        super(time, EventType.Text, character);
    }
}

export class Buff extends Event {
    constructor (
        time: number,
        character: number,
        readonly art: number,
        readonly duration: number
    ) {
        super(time, EventType.Buff, character);
    }
}
