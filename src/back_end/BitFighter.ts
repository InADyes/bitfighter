import { generateBitBoss } from './generateBitBoss';
import { Status, cardStats } from '../shared/Status';
import { Character, pickCharacter, characters, rarities, artURLs } from '../shared/characterPicker';
import { BackToFrontMessage, CharacterListItem, QueueItem } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { BackendSettings as Settings, GameSave } from './interfaces';
import { CharacterChoiceHandler } from './CharacterChoiceHandler';
import { Donation } from '../shared/interfaces/interfaces';
import { Arena } from './Arena';
import { validateDonation, validateSettings } from './validations';

export class BitFighter {
    private readonly queue: Status[] = [];
    private timeout: NodeJS.Timer | null = null;

    private readonly characterChoiceHandler: CharacterChoiceHandler;
    private arena: Arena;
    private settings: Readonly<Settings>;

    constructor(
        private sendMessageToFront: (
            message: BackToFrontMessage,
            fan?: number
        ) => void,
        settings: Settings,
        private readonly setSaveJSON: (jsonStr: string) => void,
        private readonly logDonation: (
            gameState: string,
            donationType: string,
            amount: number
        ) => void,
        gameStateJSON?: string
    ) {

        // --- initialize properties
        const ret = validateSettings(settings);
        this.settings = ret.settings;

        this.characterChoiceHandler = new CharacterChoiceHandler(
            status => this.newCombatant(status),
            (characterChoices, id) => this.sendMessageToFront({characterChoices}, id),
            this.settings
        );
        this.arena = new Arena(
            this.settings,
            (newReel, timer) => {
                this.saveState();
                this.sendMessageToFront({
                    newReel,
                    queue: newReel.patch ? undefined : this.buildQueueMessage(),
                    timer
                });
            },
            () => this.addToArena()
        );
        // ---


        if (gameStateJSON) {
            const save = <GameSave>JSON.parse(gameStateJSON);
            // status's must be cloned becaused they have no methods as they came from the JSON
            this.queue.push(...save.queue.map(s => Status.clone(s)));
            this.queue.push(...save.pendingChoices.map(c => 
                Status.clone(c.characters[Math.floor(Math.random() * c.characters.length)])
            ));
            this.arena.addCombatants(0, ...save.arena.map(s => Status.clone(s)));
        } else {
            this.arena.addCombatants(0, this.buildDefaultCombatant());
        }
    }

    private buildDefaultCombatant(): Status {
        if (this.settings.bitFighterEnabled)
            return pickCharacter(
                this.settings.defaultChampion,
                Math.floor(Math.random() * (characters.length - 2)),
                this.settings.characterNames
            );
        return generateBitBoss(this.settings.defaultChampion, this.settings.bitBossStartingHealth);
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

    public bossKill() {
        this.arena.bossKill();
        if (this.arena.getCombatants().length < 1)
            this.arena.addCombatants(0, this.buildDefaultCombatant());
    }

    public applySettings(settings: Settings) {
        this.settings = settings;
        this.arena.settings = settings;
    }

    private saveState() {
        const save: GameSave = {
            arena: this.arena.results,
            queue: this.queue,
            pendingChoices: this.characterChoiceHandler.pendingCharacterChoices
        };
        this.setSaveJSON(JSON.stringify(save));
    }

    private buildQueueMessage(timer?: number): QueueItem[] {
        return this.queue.map(s => ({
            fanDisplayName: s.name, 
            championTypeName: characters[s.character].name
        }));
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
                this.sendMessageToFront({
                    updateBossMessage: {
                        championIndex: 0,
                        bossMessage: message
                    }
                });
            }
        } else {
            this.sendMessageToFront(
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
            this.sendMessageToFront({
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

        this.sendMessageToFront(
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
                        flavorText: c.flavorText,
                        classArtURL: artURLs[i]
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
        bossEmoticonURL: string,
        bitBossCheerMote: boolean
    ) {
        const result = validateDonation({
            id,
            name,
            amount,
            profileImageURL,
            bossMessage,
            bossEmoticonURL,
            bitBossCheerMote
        });
        if (result.err)
            return;
        const donation = result.donation;

        const gameState = this.arena.isBusy() ? 'fighting' : 'waiting';

        const combatantIndex = this.arena.searchForCombatant(id);
        // if the donation matches a fighter
        if (combatantIndex !== -1) {
            this.logDonation(gameState, 'heal', donation.amount);
            this.arena.healCombatant(combatantIndex, donation);

        // if the donation is enough for a character and they aren't already in the queue or have a pending choice
        } else if (
            this.settings.bitFighterEnabled
            && this.queue.some(s => s.id === donation.id) === false
            && amount >= this.settings.minimumDonation
            && this.characterChoiceHandler.hasPendingChoice(id) === false
        ) {
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


        if (this.arena.isBusy() === false) {
            this.addToArena(this.arena.getCombatants().length > 0 ? 5000 : undefined);
        } else {
            this.sendMessageToFront({
                queue: this.buildQueueMessage()
            });
            this.saveState();
        }
    }

    private addToArena(countdown?: number) {
        const newFighterCount = 2 - this.arena.getCombatants().length;

        if (this.queue.length < 1 || newFighterCount < 0)
            return;

        this.arena.addCombatants(
            countdown || 0,
            ...this.queue.splice(0, newFighterCount)
        );
    }
}
