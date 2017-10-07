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

    private characterChoiceHandler = new CharacterChoiceHandler(
        status => {
            this.newCombatant(status);
        },
        (characterChoices, id) => {
            this.sendMessageToFont({characterChoices}, id);
        }
    );
    private game = new Game(
        (message, fan) => {
            message.queue =  { queue: this.queue.map(s => ({
                fanDisplayName: s.name, 
                championTypeName: characters[s.character].name
            }))},
            this.sendMessageToFont(message, fan);
        }
    );

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
        this.combatants.push(pickCharacter(
            this.settings.defaultChampion,
            Math.floor(Math.random() * characters.length))
        );
    }

    public bossMessageUpdate(id: number, message: string) {
        // TODO: make this work for people in queue and on the right side of a fight
        if (this.combatants[0] === undefined
            || this.combatants[0].id !== id) {
            console.log('boss message update is not from the current boss');
            return;
        }
        this.combatants[0].bossMessage = message;
        this.sendMessageToFont({
            updateBossMessage: {
                championIndex: 0,
                bossMessage: message
            }
        });
    }

    public bossEmoticonURLUpdate(id: number, bossEmoticonURL: string) {
        // TODO: make this work for people in queue and on the right side of a fight
        if (this.combatants[0] === undefined
            || this.combatants[0].id !== id) {
            console.log('boss message update is not from the current boss');
            return;
        }
        this.combatants[0].bossEmoticonURL = bossEmoticonURL;
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
            this.pushLastResults(undefined, id);
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

        const combatantIndex: number = this.combatants.findIndex(s => s.id === id);
        // if the donation matches a fighter
        if (combatantIndex !== -1) {
            this.healCombatant(combatantIndex, donation);
        // if the donation is enough for a character and they aren't already in the queue
        } else if (this.queue.some(s => {return s.id === id;}) === false
            && amount >= this.settings.minimumDonation) {
            this.characterChoiceHandler.requestChoice(donation);

        // if there is a champion deal damage to him
        } else if (this.combatants.length > 0) {
            this.damageCombatant(0, donation);
        }
    }

    public checkQueue() {
        if (this.queue.length > 0)
            this.nextFight();
        else if (this.combatants.length == 0) {
            this.combatants.push(pickCharacter(
                this.settings.defaultChampion,
                Math.floor(Math.random() * characters.length)
            ));
            this.nextFight();
        }
    }
    
    // public for testing purposes (bypasses front end character choice)
    public newCombatant(status: Status) {
        this.queue.push(status)
        if (this.queue.length === 1 && this.timeout === null) {
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
        this.game.addCombatant(this.queue);
    }
}
