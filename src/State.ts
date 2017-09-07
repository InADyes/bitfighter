export const enum EventType {

} 

export interface Event {
    readonly timout: number,
    readonly character: number,
    readonly type: EventType,
    readonly value?: number | string
}

export interface HealthUpdate extends Event {
    readonly health: number
}

export interface StateUpdate extends Event {

}

export interface AttackUpdate extends Event {

}

export interface ClearUpdate extends Event {

}

export interface PowerUpdate extends Event {
    
}
