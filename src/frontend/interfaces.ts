import {
    CharacterCard,
    CharacterListItem,
    FrontendCharacter,
    QueueItem
} from '../shared/interfaces/backToFrontMessage';

export interface State {
    timer?: number;
    hoverCards: CharacterCard[];
    combatants: FrontendCharacter[];
    queue: QueueItem[];
    characterList: CharacterListItem[];
    characterChoices?: CharacterCard[];
}
