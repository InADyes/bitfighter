import { GraphicsEvent } from '../shared/interfaces/graphicsEvents';
import {
    CharacterCard,
    CharacterListItem,
    FrontendCharacter,
    QueueItem,
    FrontEndSettings,
    ReelMessage
} from '../shared/interfaces/backToFrontMessage';

export interface State {
    countDownTo: number;
    fight: ReelMessage;
    queue: QueueItem[];
    characterList: CharacterListItem[];
    characterChoices: {
        cards: CharacterCard[];
        endTime: number;
        callBack: (character: number) => void;
    };
    settings: FrontEndSettings | null;
    view: 'bitBoss' | 'bitFighter';
}
