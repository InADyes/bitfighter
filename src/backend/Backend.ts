import { Buff } from '../shared/interfaces/buff';
import { pickCharacter } from '../shared/characterPicker';
import { Combatant } from '../shared/Combatant';
import { characterSheets } from '../shared/globals/characterSheets';
import { rarityInfo } from '../shared/globals/rarity';
import { BackToFrontMessage, QueueItem } from '../shared/interfaces/backToFrontMessage';
import { FrontToBackMessage } from '../shared/interfaces/frontToBackMessage';
import { Item, Character } from '../shared/interfaces/interfaces';
import { Arena } from './Arena';
import { CharacterChoiceHandler } from './CharacterChoiceHandler';
import { generateBitBoss } from './generateBitBoss';
import { BackendSettings, GameSave } from './interfaces';
import { validateDonation, validateSettings } from './validations';
import * as _ from 'lodash';

/**
 * Main backend module. One instance supports one influencer game instance.
 */
export class Backend {
    private readonly queue: Combatant[] = [];
    private timeout: NodeJS.Timer | null = null;
    private readonly characterChoiceHandler: CharacterChoiceHandler;
    private arena: Arena;
    private readonly characterSheets: Character[];

    constructor(
        private sendMessageToFront: (
            message: BackToFrontMessage,
            fan?: string
        ) => void,
        private settings: Readonly<BackendSettings>,
        private readonly setSaveJSON: (jsonStr: string) => void,
        private readonly logDonation: (
            gameState: string,
            donationType: string,
            amount: number
        ) => void,
        gameStateJSON?: string
    ) {

        // --- initialize properties
        this.characterSheets = characterSheets.map(c => _.cloneDeep(c));
        this.updateSettings(settings);

        this.characterChoiceHandler = new CharacterChoiceHandler(
            combatant => this.newCombatant(combatant),
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
            () => this.addToArena(),
            this.characterSheets
        );
        // ---

        if (gameStateJSON) {
            const save = JSON.parse(gameStateJSON) as GameSave;
            // combatant's must be cloned becaused they have no methods as they came from the JSON
            this.queue.push(...save.queue.map(s => Combatant.clone(s)));
            this.queue.push(...save.pendingChoices.map(c => 
                Combatant.clone(c.characters[Math.floor(Math.random() * c.characters.length)])
            ));
            this.arena.addCombatants(0, ...save.arena.map(s => Combatant.clone(s)));
        } else {
            this.arena.addCombatants(0, this.buildDefaultCombatant());
        }
    }

    private buildDefaultCombatant(): Combatant {
        if (this.settings.bitFighterEnabled)
            return pickCharacter(
                this.settings.defaultChampion,
                this.characterSheets[Math.floor(Math.random() * (this.characterSheets.length - 2))]
            );
        return generateBitBoss(this.settings.defaultChampion, this.characterSheets, this.settings.bitBossStartingHealth);
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

    /**
     * Kills the current chapion or bitBoss.
     */
    public bossKill() {
        this.arena.bossKill();
        if (this.arena.combatants.length < 1)
            this.arena.addCombatants(0, this.buildDefaultCombatant());
    }

    /**
     * Updates the game settings.
     */
    public applySettings(settings: BackendSettings) {
        this.updateSettings(settings);
        this.arena.settings = this.settings;
    }

    private updateSettings(settings: BackendSettings) {
        const ret = validateSettings(settings);
        this.settings = ret.settings;
        for (let i = 0; i < characterSheets.length; i++)
            applySettingsToCharacter(this.characterSheets[i], characterSheets[i], ret.settings);

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
            championTypeName: s.character.name
        }));
    }

    /**
     * If a fan tries to update their bossMessage this function should be called.
     */
    public bossMessageUpdate(id: string, message: string) {
        // TODO: make this work for people in queue and on the right side of a fight
        const index = this.arena.searchForCombatant(id);

        if (index === -1) {
            console.log('boss message update id does not match a currently fighting champion');
            return;
        }
        if (this.arena.combatants[index].setBossMessage(message)) {
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

    /**
     * If a fan tries to update their bossEmoticon this function should be called.
     */
    public bossEmoticonURLUpdate(id: string, bossEmoticonURL: string) {
        // TODO: make this work for people in queue and on the right side of a fight

        const index = this.arena.searchForCombatant(id);

        if (index === -1) {
            console.log('boss emoticon update id does not match a currently fighting champion');
            return;
        }
        this.arena.combatants[index].bossEmoticonURL = bossEmoticonURL;
        if (index === 0) {
            this.sendMessageToFront({
                updateBossEmoticonURL: {
                    championIndex: 0,
                    bossEmoticonURL: bossEmoticonURL
                }
            });
        }
    }

    /**
     * Called when the front end sends something back. Routs the message parts.
     */
    public receivedFanGameState(id: string, choice: FrontToBackMessage) {
        if (choice.characterChoice)
            this.characterChoiceHandler.completeChoice(id, choice.characterChoice, true);
        if (choice.requestReel)
            this.initFans(id);
    }

    /**
     * Sends the current state to everyone or just one person if a fan is specified. 
     */
    private initFans(id?: string) {

        this.sendMessageToFront(
            {
                queue: this.buildQueueMessage(),
                newReel: this.arena.buildReelMessage(),
                characterList: characterSheets.filter(c => c.name != '').map(c => {
                    const crit = c.crits.find(c => (c.buff || c.debuff) !== undefined)
                    const buff = crit ? (crit.buff || crit.debuff) : undefined;

                    return {
                        stats: c.cardStats,
                        className: this.settings.characterNames[c.name] || c.name,
                        skillName: buff ? buff.name : 'NO BUFF FOUND',
                        skillURL: buff ? this.settings + buff.artPath : 'no buff',
                        rarityName: rarityInfo[c.rarity].name || 'rarity not found',
                        rarityColor: rarityInfo[c.rarity].color || 'rarity not found',
                        flavorText: c.flavorText,
                        classArtURL: this.settings.assetPathPrefix + c.artPath,
                        attackGraphicsURLs: this.settings.assetPathPrefix + c.attackGraphicsPath
                    }
                }),
                settings: this.settings.frontendSettings
            },
            id
        )
    }

    public donation(
        id: string,
        name: string,
        amount: number,
        profileImageURL: string,
        bossMessage: string = this.settings.defaultBossMessage,
        bossEmoticonURL: string,
        bitBossCheerMote: boolean,
        ...items: Item[]
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

        const inArena = this.arena.combatants.some(s => s.id === id);
        // if the donation matches a fighter
        if (inArena) {
            this.logDonation(gameState, 'heal', donation.amount);
            this.arena.healCombatant(donation.id, donation);

        // if the donation is enough for a character and they aren't already in the queue or have a pending choice
        } else if (
            this.settings.bitFighterEnabled
            && this.queue.some(s => s.id === donation.id) === false
            && amount >= this.settings.minimumDonation
            && this.characterChoiceHandler.hasPendingChoice(id) === false
        ) {
            this.logDonation(gameState, 'newCombatant', donation.amount);
            this.characterChoiceHandler.requestChoice(donation, this.characterSheets, ...items);

        // otherwise try and damage the chapion
        } else {
            this.logDonation(gameState, 'damage', donation.amount);
            this.arena.damageCombatant(0, donation);
        }
    }
    
    // public for testing purposes (bypasses front end character choice)
    private newCombatant(combatant: Combatant) {
        this.queue.push(combatant)


        if (this.arena.isBusy() === false) {
            this.addToArena(this.arena.combatants.length > 0 ? 5000 : undefined);
        } else {
            this.sendMessageToFront({
                queue: this.buildQueueMessage()
            });
            this.saveState();
        }
    }

    public useItem(fanID: string, item: Item) {
        let combatant: Combatant | undefined;

        if (combatant = this.queue.find(c => c.id === fanID)) {
            combatant.useItem(item);
        } else if (combatant = this.arena.combatants.find(c => c.id === fanID)) {
            combatant.useItem(item);
            this.arena.startFight();
        }
    }

    private addToArena(countdown?: number) {
        const newFighterCount = 2 - this.arena.combatants.length;

        if (this.queue.length < 1 || newFighterCount < 0)
            return;

        this.arena.addCombatants(
            countdown || 0,
            ...this.queue.splice(0, newFighterCount)
        );
    }
}

/*
** Could change the way settings are applied for less memory usage.
*/

function applySettingsToCharacter(
    target: Character,
    original: Readonly<Character>,
    settings: BackendSettings
) {
    const t = target;
    const o = original;
    const s = settings;

    if (s.characterArt[o.name])
        t.artPath = s.assetPathPrefix + o.artPath;
    t.artPath = s.assetPathPrefix + o.artPath;
    if (o.attackGraphicsPath) {
        for (let i = 0; i < o.attackGraphicsPath.length; i++) {
            if (t.attackGraphicsPath)
                t.attackGraphicsPath[i] = s.assetPathPrefix + o.attackGraphicsPath[i];
        }
    }
    if (s.characterNames[o.name])
        t.name = s.characterNames[t.name];
    for (let i = 0; i < o.crits.length; i++) {
        if (t.crits[i].buff) // wtf do i need these casts??
            (t.crits[i].buff as Buff).artPath = s.assetPathPrefix + (o.crits[i].buff as Buff).artPath;
        if (t.crits[i].debuff)
            (t.crits[i].debuff as Buff).artPath = s.assetPathPrefix + (o.crits[i].debuff as Buff).artPath;
    }
}
