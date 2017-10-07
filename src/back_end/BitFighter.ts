import { sortGraphicsEvents } from '../shared/buildGraphicsEvents';
import { buildEvents } from '../shared/buildEvents';
import { Stats, Status, cardStats } from '../shared/Status';
import { Character, pickCharacter, characters } from '../shared/characterPicker';
import * as FightEvents from '../shared/fightEvents';
import * as graphicsEvents from '../shared/graphicsEvents';
import { BackToFrontMessage } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { BackendSettings as Settings } from './settings'
import { applyFightEvents, CombinedEvent } from '../shared/applyFightEvents'
import { CharacterChoiceHandler } from './characterChoiceHandler';
import { hrtime } from 'process';
import { Donation } from '../shared/interfaces/donation';

import { Game } from './Game';

function nodePerformanceNow() {
    if (hrtime) {
        const time = hrtime();
        return time[0] * 1e3 + time[1] / 1e6;
    }
    return performance.now();
};

export class BitFighter {
    private queue: Status[] = [];
    private timeout: NodeJS.Timer | null = null;

    private characterChoiceHandler = new CharacterChoiceHandler(
        status => {
            this.newCombatant(status);
        },
        (characterChoices, id) => {
            this.sendMessageToFont({characterChoices}, id);
        }
    );
    private game: Game;

    constructor(
        private sendMessageToFont: (message: BackToFrontMessage, fan?: number) => void,
        public settings: Settings = {
            delayBetweenFights: 3000,
            minimumDonation: 200,
            donationToHPRatio: 1,
            defaultBossEmoticonURL: '',
            defaultBossMessage: 'heeeeeyyyyy',
            defaultChampion: {
                id: -1,
                name: 'tim',
                amount: 1000,
                profileImageURL: '',
                bossMessage: 'look at me',
                bossEmoticonURL: '',
            }
        },
        private readonly saveGameState: (jsonStr: string) => void,
        gameStateJSON?: string
    ) {
        if (this.settings.defaultChampion.id === 123544090)
            this.settings.defaultChampion.name = 'Ravioli';
        this.game = new Game(
            this.settings,
            (message, fan) => {
                message.queue =  { queue: this.queue.map(s => ({
                    fanDisplayName: s.name, 
                    championTypeName: characters[s.character].name
                }))},
                this.sendMessageToFont(message, fan);
            },
            () => this.checkQueue()
        );
        this.game.addCombatant(pickCharacter(
            this.settings.defaultChampion,
            Math.floor(Math.random() * characters.length))
        );
    }

    public bossMessageUpdate(id: number, message: string) {
        // TODO: make this work for people in queue and on the right side of a fight
        const index = this.game.searchFightForCombatant(id);

        if (id === -1) {
            console.log('boss message update id does not match a currently fighting champion');
            return;
        }
        this.game.getCombatants()[0].bossMessage = message;
        this.sendMessageToFont({
            updateBossMessage: {
                championIndex: 0,
                bossMessage: message
            }
        });
    }

    public bossEmoticonURLUpdate(id: number, bossEmoticonURL: string) {
        // TODO: make this work for people in queue and on the right side of a fight

        const index = this.game.searchFightForCombatant(id);

        if (id === -1) {
            console.log('boss emoticon update id does not match a currently fighting champion');
            return;
        }
        this.game.getCombatants()[0].bossEmoticonURL = bossEmoticonURL;
        this.sendMessageToFont({
            updateBossEmoticonURL: {
                championIndex: 0,
                bossEmoticonURL: bossEmoticonURL
            }
        });
    }

    public receivedFanGameState(id: number, choice: FrontToBackMessage) {
        if (choice.characterChoice)
            this.characterChoiceHandler.completeChoice(id, choice.characterChoice.choice, true);
        if (choice.requestReel)
            this.game.pushLastResults(undefined, id);
    }
    public donation(
        id: number,
        name: string,
        amount: number,
        profileImageURL: string,
        bossMessage: string = this.settings.defaultBossMessage,
        bossEmoticonURL: string
    ) {
        const donation: Donation = {
            id,
            name,
            amount,
            profileImageURL,
            bossMessage,
            bossEmoticonURL
        };

        const combatantIndex: number = this.game.searchFightForCombatant(id);
        // if the donation matches a fighter
        if (combatantIndex !== -1) {
            this.game.healCombatant(combatantIndex, donation);
        // if the donation is enough for a character and they aren't already in the queue
        } else if (this.queue.some(s => {return s.id === id;}) === false
            && amount >= this.settings.minimumDonation) {
            this.characterChoiceHandler.requestChoice(donation);

        // otherwise try and damage the chapion
        } else {
            this.game.damageCombatant(0, donation);
        }
    }

    public checkQueue() {
        if (this.queue.length > 0)
            this.nextFight();
        // else if (this.game.getCombatants().length == 0) {
        //     this.game.getCombatants().push(pickCharacter(
        //         this.settings.defaultChampion,
        //         Math.floor(Math.random() * characters.length)
        //     ));
        //     this.nextFight();
        // }
    }
    
    // public for testing purposes (bypasses front end character choice)
    public newCombatant(status: Status) {
        this.queue.push(status)
        if (this.queue.length === 1 && this.game.isBusy() === false) {
            const timeout = 5000;

            this.timeout = setTimeout(
                () => {
                    this.timeout = null;
                    this.nextFight()
                },
                timeout // TODO: make this a setting
            );
            this.sendMessageToFont({
                queue: {
                    queue: this.queue.map(s => ({
                        fanDisplayName: s.name, 
                        championTypeName: characters[s.character].name
                    })),
                    timer: timeout
                }
            })
        }
        else {
            this.sendMessageToFont({
                queue: { queue: this.queue.map(s => ({
                    fanDisplayName: s.name, 
                    championTypeName: characters[s.character].name
                }))}
            })
        }
    }
    
    // start a new fight, maybe rename to queue change
    private nextFight() {
        this.game.addCombatant(...this.queue);
    }
}
