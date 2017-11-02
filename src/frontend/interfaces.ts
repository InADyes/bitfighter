import {
    CharacterCard,
    CharacterListItem,
    FrontendCharacter,
    QueueItem,
    FrontEndSettings
} from '../shared/interfaces/backToFrontMessage';

export interface State {
    countDown: number;
    combatants: FrontendCharacter[];
    queue: QueueItem[];
    characterList: CharacterListItem[];
    characterChoices: {
        card: CharacterCard;
        onClick: () => void;
    }[] | null;
    settings: FrontEndSettings | null;
    view: 'bitBoss' | 'bitFighter';
}
