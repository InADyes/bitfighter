import {
    CharacterCard,
    CharacterListItem,
    FrontendCharacter,
    QueueItem
} from '../shared/interfaces/backToFrontMessage';

export interface State {
    timerEndTime: number;
    combatants: FrontendCharacter[];
    queue: QueueItem[];
    characterList: CharacterListItem[];
    characterChoices?: {
        card: CharacterCard;
        onClick: () => void;
    }[];
}
