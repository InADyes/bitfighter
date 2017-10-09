import { Status } from '../shared/Status';
import { Character, pickCharacter, characters } from '../shared/characterPicker';
import { BackToFrontMessage, Queue as QueueMessage } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { BackendSettings as Settings } from './settings'
import { CharacterChoiceHandler } from './characterChoiceHandler';
import { Donation } from '../shared/interfaces/donation';
import { Arena } from './Arena';

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
    private arena: Arena;

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
        private readonly saveArenaState: (jsonStr: string) => void,
        gameStateJSON?: string
    ) {
        if (this.settings.defaultChampion.id === 123544090)
            this.settings.defaultChampion.name = 'Ravioli';
        this.arena = new Arena(
            this.settings,
            (newReel) => {
                this.sendMessageToFont({
                    newReel,
                    queue: newReel.patch ? undefined : this.buildQueueMessage()
                });
            },
            () => this.addToArena()
        );
        this.arena.addCombatants(pickCharacter(
            this.settings.defaultChampion,
            Math.floor(Math.random() * characters.length))
        );
    }

    private buildQueueMessage(timer?: number): QueueMessage {
        return {
            queue: this.queue.map(s => ({
                fanDisplayName: s.name, 
                championTypeName: characters[s.character].name
            })),
            timer: timer
        }
    }

    public bossMessageUpdate(id: number, message: string) {
        // TODO: make this work for people in queue and on the right side of a fight
        const index = this.arena.searchForCombatant(id);

        if (id === -1) {
            console.log('boss message update id does not match a currently fighting champion');
            return;
        }
        this.arena.getCombatants()[0].bossMessage = message;
        this.sendMessageToFont({
            updateBossMessage: {
                championIndex: 0,
                bossMessage: message
            }
        });
    }

    public bossEmoticonURLUpdate(id: number, bossEmoticonURL: string) {
        // TODO: make this work for people in queue and on the right side of a fight

        const index = this.arena.searchForCombatant(id);

        if (id === -1) {
            console.log('boss emoticon update id does not match a currently fighting champion');
            return;
        }
        this.arena.getCombatants()[0].bossEmoticonURL = bossEmoticonURL;
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
            this.sendMessageToFont(
                {
                    queue: this.buildQueueMessage(),
                    newReel: this.arena.lastResults()
                },
                id
            )
            //this.arena.pushLastResults(undefined, id);
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

        const combatantIndex: number = this.arena.searchForCombatant(id);
        // if the donation matches a fighter
        if (combatantIndex !== -1) {
            this.arena.healCombatant(combatantIndex, donation);
        // if the donation is enough for a character and they aren't already in the queue
        } else if (this.queue.some(s => {return s.id === id;}) === false
            && amount >= this.settings.minimumDonation) {
            this.characterChoiceHandler.requestChoice(donation);

        // otherwise try and damage the chapion
        } else {
            this.arena.damageCombatant(0, donation);
        }
    }
    
    // public for testing purposes (bypasses front end character choice)
    public newCombatant(status: Status) {
        this.queue.push(status)

        if (this.queue.length === 1 && this.arena.isBusy() === false) {
            const timeout = 5000;

            this.timeout = setTimeout(
                () => {
                    this.timeout = null;
                    this.addToArena()
                },
                timeout // TODO: make this a setting
            );
            this.sendMessageToFont({
                queue: this.buildQueueMessage(timeout)
            });
        } else {
            this.sendMessageToFont({
                queue: this.buildQueueMessage()
            });
        }
    }
    
    // start a new fight, maybe rename to queue change
    private addToArena() {
        if (this.queue.length < 1)
            return;


        let newFighterCount = 2 - this.arena.getCombatants().length;

        if (newFighterCount < 0)
            newFighterCount = 0;
        this.arena.addCombatants(  ...this.queue.splice(0, newFighterCount));
    }
}
