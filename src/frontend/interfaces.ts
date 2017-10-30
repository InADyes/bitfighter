import {
    CharacterCard,
    CharacterListItem,
    FrontendCharacter,
    QueueItem
} from '../shared/interfaces/backToFrontMessage';

export interface State {
    timerEndTime: number;
    hoverCards: CharacterCard[];
    combatants: FrontendCharacter[];
    queue: QueueItem[];
    characterList: CharacterListItem[];
    characterChoices?: CharacterCard[];
}
