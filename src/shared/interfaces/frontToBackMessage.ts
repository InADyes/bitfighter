export interface CharacterChoice {
    choice: number;
}

export interface FrontToBackMessage {
    characterChoice?: CharacterChoice;
    requestReel?: true;
}
