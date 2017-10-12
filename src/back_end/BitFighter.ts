import { generateBitBoss } from './generateBitBoss';
import { Status, cardStats } from '../shared/Status';
import { Character, pickCharacter, characters, rarities } from '../shared/characterPicker';
import { BackToFrontMessage, CharacterListItem, Queue as QueueMessage } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { BackendSettings as Settings, GameSave } from './interfaces';
import { CharacterChoiceHandler } from './characterChoiceHandler';
import { Donation } from '../shared/interfaces/donation';
import { Arena } from './Arena';

function logDonation(gameState: string, donationType: string, amount: number) {
    console.log(`donation: ${ gameState }, ${ donationType }, ${ amount }`);
}

export class BitFighter {
    private readonly queue: Status[] = [];
    private timeout: NodeJS.Timer | null = null;

    private readonly characterChoiceHandler = new CharacterChoiceHandler(
        status => this.newCombatant(status),
        (characterChoices, id) => this.sendMessageToFont({characterChoices}, id),
        this.settings
    );
    private arena: Arena;

    constructor(
        private sendMessageToFont: (
            message: BackToFrontMessage,
            fan?: number
        ) => void,
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
                bitBossCheerMote: true
            },
            characterNames: {},
            bitFighterEnabled: true,
            bitBossStartingHealth: 1000
        },
        private readonly setSaveJSON: (jsonStr: string) => void,
        private readonly logDonation: (
            gameState: string,
            donationType: string,
            amount: number
        ) => void,
        gameStateJSON?: string
    ) {
        if (this.settings.defaultChampion.id === 123544090)
            this.settings.defaultChampion.name = 'Ravioli';

        this.arena = new Arena(
            this.settings,
            newReel => {
                this.saveState();
                this.sendMessageToFont({
                    newReel,
                    queue: newReel.patch ? undefined : this.buildQueueMessage()
                });
            },
            () => this.addToArena()
        );
        if (gameStateJSON) {
            const save = <GameSave>JSON.parse(gameStateJSON);
            this.queue.push(...save.queue.map(s => Status.clone(s)));
            this.arena.addCombatants(...save.arena.map(s => Status.clone(s)));
        } else {
            this.arena.addCombatants(
                this.settings.bitFighterEnabled
                    ? pickCharacter(
                        this.settings.defaultChampion,
                        Math.floor(Math.random() * (characters.length - 2)),
                        this.settings.characterNames
                    )
                    : generateBitBoss(this.settings.defaultChampion, this.settings.bitBossStartingHealth)
            );
        }
    }

    public clearTimeouts() {
        // right now doing all this may send a bunch of extra reels to the front end to update the queue
        this.characterChoiceHandler.clearTimeouts();
        this.arena.clearTimeouts();
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    private saveState() {
        const save: GameSave = {
            arena: this.arena.getCombatants(),
            queue: this.queue
        };
        this.setSaveJSON(JSON.stringify(save));
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
        if (this.arena.getCombatants()[index].setBossMessage(message)) {
            if (index === 0) {
                this.sendMessageToFont({
                    updateBossMessage: {
                        championIndex: 0,
                        bossMessage: message
                    }
                });
            }
        } else {
            this.sendMessageToFont(
                {
                    bossMessageChangeFailed: true
                },
                id
            )
        }
    }

    public bossEmoticonURLUpdate(id: number, bossEmoticonURL: string) {
        // TODO: make this work for people in queue and on the right side of a fight

        const index = this.arena.searchForCombatant(id);

        if (index === -1) {
            console.log('boss emoticon update id does not match a currently fighting champion');
            return;
        }
        this.arena.getCombatants()[index].bossEmoticonURL = bossEmoticonURL;
        if (index === 0) {
            this.sendMessageToFont({
                updateBossEmoticonURL: {
                    championIndex: 0,
                    bossEmoticonURL: bossEmoticonURL
                }
            });
        }
    }

    public receivedFanGameState(id: number, choice: FrontToBackMessage) {
        if (choice.characterChoice)
            this.characterChoiceHandler.completeChoice(id, choice.characterChoice.choice, true);
        if (choice.requestReel)
            this.initFans(id);
    }

    private initFans(id?: number) {

        this.sendMessageToFont(
            {
                queue: this.buildQueueMessage(),
                newReel: this.arena.lastResults(),
                characterList: characters.filter(c => c.name != '').map((c, i) => {
                    const crit = c.crits.find(c => (c.buff || c.debuff) !== undefined)
                    const buff = crit ? (crit.buff || crit.debuff) : undefined;

                    return {
                        stats: cardStats[i],
                        className: this.settings.characterNames[c.name] || c.name,
                        skillName: buff ? buff.name : 'NO BUFF FOUND',
                        skillURL: buff ? buff.url : 'no buff',
                        rarityName: rarities[c.rarity].name || 'rarity not found',
                        rarityColor: rarities[c.rarity].color || 'rarity not found',
                        flavorText: c.flavorText
                    }
                })
            },
            id
        )
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
            bossEmoticonURL,
            bitBossCheerMote: true
        };

        const gameState = this.arena.isBusy() ? 'fighting' : 'waiting';

        const combatantIndex: number = this.arena.searchForCombatant(id);
        // if the donation matches a fighter
        if (combatantIndex !== -1) {
            this.logDonation(gameState, 'heal', donation.amount);
            this.arena.healCombatant(combatantIndex, donation);

        // if the donation is enough for a character and they aren't already in the queue
        } else if (this.settings.bitFighterEnabled && this.queue.some(s => {return s.id === id;}) === false
            && amount >= this.settings.minimumDonation) {
            this.logDonation(gameState, 'newCombatant', donation.amount);
            this.characterChoiceHandler.requestChoice(donation);

        // otherwise try and damage the chapion
        } else {
            this.logDonation(gameState, 'damage', donation.amount);
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
                    this.addToArena();
                },
                timeout // TODO: make this a setting
            );
            this.sendMessageToFont({
                queue: this.buildQueueMessage(timeout)
            });
        // if (this.arena.isBusy() === false) {
        //     this.addToArena();
        } else {
            this.sendMessageToFont({
                queue: this.buildQueueMessage()
            });
        }
    }
    
    // start a new fight, maybe rename to queue change
    private addToArena() {
        const newFighterCount = 2 - this.arena.getCombatants().length;

        if (this.queue.length < 1 || newFighterCount < 0)
            return;

        this.arena.addCombatants(  ...this.queue.splice(0, newFighterCount));
    }
}
