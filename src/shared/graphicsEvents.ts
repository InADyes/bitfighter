export interface Event {
        time: number;
        type: string;
        character: number;
}

export interface Health extends Event {
        type: 'health';
        attacker: string | null;
        health: number; // delta
}

export interface Attack extends Event {
        type: 'attack';
}

export interface Clear extends Event {
        type: 'clear';
}

export interface Text extends Event {
        type: 'text';
        duration: number;
        text: string;
        color: string; //should this be a string?
}

export interface Buff extends Event {
        type: 'buff';
        art: number;
        duration: number;
}

export type GraphicsEvent = Health | Attack | Clear | Text | Buff;
