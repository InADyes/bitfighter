export const enum EventType {
    Health,
    Attack,
    Clear,
    Text,
    Start
}

export abstract class Event {
    constructor (public timeout: number, readonly type: EventType) {}; //only public for now to make things more easy
}

// needs more finished Combatant Information
export class StartUpdate extends Event {
    constructor (
        readonly timeout: number
    ) {
        super(timeout, EventType.Start);
    }
}

export abstract class CombatantEvent extends Event {
    constructor (
        timeout: number,
        type: EventType,
        public character: number
    ) {
        super(timeout, type);
    }
}

export class HealthUpdate extends CombatantEvent {
    constructor (
        timeout: number,
        character: number,
        readonly health: number
    ) {
        super(timeout, EventType.Health, character);
    }
}

export class AttackUpdate extends CombatantEvent {
    constructor (
        timeout: number,
        character: number
    ) {
        super(timeout, EventType.Attack, character);
    }
}

export class ClearUpdate extends CombatantEvent {
    constructor (
        timeout: number,
        character: number
    ) {
        super(timeout, EventType.Clear, character);
    }
}

export class TextUpdate extends CombatantEvent {
    constructor (
        timeout: number,
        character: number,
        readonly text: string,
        readonly color: string //should this be a string?
    ) {
        super(timeout, EventType.Text, character);
    }
}
