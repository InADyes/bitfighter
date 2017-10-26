interface Event {
    time: number;
    type: string;
    character: number;
}

interface Health extends Event {
    type: 'health';
    attacker: string | null;
    health: number; // delta
}

interface Attack extends Event {
    type: 'attack';
}

interface Clear extends Event {
    type: 'clear';
}

interface Text extends Event {
    type: 'text';
    duration: number;
    text: string;
    color: string; //should this be a string?
}

interface Buff extends Event {
    type: 'buff';
    art: number;
    duration: number;
}

/**
 * Events sent to the front end used to represent the fight.
 */
export type GraphicsEvent = Health | Attack | Clear | Text | Buff;
