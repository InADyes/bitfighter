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

function nodePerformanceNow() {
    if (hrtime) {
        const time = hrtime();
        return time[0] * 1e3 + time[1] / 1e6;
    }
    return performance.now();
};

export class BitFighter {
    private fightStartTime: number = 0;
    private timeout: NodeJS.Timer | null = null;
    private combatants: Status[] = [];
    private events: CombinedEvent[] = [];
    private queue: Status[] = [];
    private lastDonation: Donation | null = null; // quick hack so if the boss dies this character goes in

    private characterChoiceHandler = new CharacterChoiceHandler(
        status => {
            this.newCombatant(status);
        },
        (characterChoices, id) => {
            this.sendMessageToFont({characterChoices}, id);
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
        console.log('------------------------> default champion profileImageURL:', this.settings.defaultChampion.profileImageURL);
        this.combatants.push(pickCharacter(this.settings.defaultChampion, Math.floor(Math.random() * characters.length)));
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
        this.lastDonation = donation;

        let combatantIndex: number;
        // if the fight is ongoing
        if (this.timeout !== null) {
            // and the donation matches a fighter
            combatantIndex = this.combatants.findIndex(s => s.id === donation.id);
            if (combatantIndex !== -1) {
                this.healCombatant(combatantIndex, this.settings.donationToHPRatio * donation.amount);
                return;
            }
        }
        combatantIndex = this.combatants.findIndex(s => s.id === id);
        if (combatantIndex !== -1) {
            this.healCombatant(combatantIndex, this.settings.donationToHPRatio);
            return;
        }

        // if the donation is enough for a character and they aren't already in the queue
        if (this.queue.some(s => {return s.id === id;}) === false
            && amount >= this.settings.minimumDonation) {
            this.characterChoiceHandler.requestChoice(donation);
            return;
        }


        // if there was a last fight, damage current champion
        if (this.combatants.length > 0) {
            const patchTime = nodePerformanceNow() - this.fightStartTime;
            this.damageCombatant(0, amount * this.settings.donationToHPRatio);
        }
    }

    private healCombatant(index: number, amount: number) {
        const patchTime = nodePerformanceNow() - this.fightStartTime;
        const combatant = this.combatants[index];

        if (combatant.hitPoints + amount > combatant.stats.maxHitPoints)
            amount = combatant.stats.maxHitPoints - combatant.hitPoints;

        this.insertEvents(
            patchTime,
            new FightEvents.Donation(
                patchTime,
                index,
                FightEvents.DonationType.healing
            ),
            new FightEvents.Healing(
                patchTime,
                index,
                amount
            )
        );
    }

    private damageCombatant(index: number, amount: number) {
        const patchTime = nodePerformanceNow() - this.fightStartTime;
        
        const combatant = this.combatants[index];
        if (combatant.hitPoints < amount)
            amount = combatant.hitPoints;

        this.insertEvents(
            patchTime,
            new FightEvents.Donation(
                patchTime,
                0,
                FightEvents.DonationType.damage
            ),
            new FightEvents.Damage(
                patchTime,
                0,
                amount
            )
        );
    }

    public checkQueue() {
        if (this.queue.length > 0)
            this.nextFight();
        else if (this.combatants.length == 0) {
            if (this.lastDonation) {
                this.combatants.push(pickCharacter(
                    this.lastDonation,
                    Math.floor(Math.random() * characters.length)
                ));
            } else {
                this.combatants.push(pickCharacter(
                    this.settings.defaultChampion,
                    Math.floor(Math.random() * characters.length)
                ));
            }
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

    // only works when all new events have the same time
    private insertEvents(patchTime: number, ...insert: FightEvents.Event[]) {

        // create a temporary copy of status
        const tempStatus = this.combatants.map(s => s.clone());

        // apply new events
        const reel = applyFightEvents(tempStatus, ...insert);

        // set the current events to the calculated events
        reel.push(...buildEvents(tempStatus, patchTime).reel);
        this.events = reel;

        this.pushLastResults(patchTime);
        
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeoutNextEvent();
    }

    // start a new fight, maybe rename to queue change
    private nextFight() {
        if (this.combatants.length >= 2) {
            console.log('cannot start fight: fight already ongoing');
            this.sendMessageToFont({
                queue: { queue: this.queue.map(s => ({
                    fanDisplayName: s.name, 
                    championTypeName: characters[s.character].name
                })) }
            });
            return;
        }

        if (this.timeout !== null)
            clearTimeout(this.timeout);

        this.combatants = this.combatants.concat(this.queue.splice(0, 2 - this.combatants.length));

        const result = buildEvents(this.combatants);
        this.fightStartTime = nodePerformanceNow();
        this.events = result.reel;

        this.pushLastResults();
        this.timeoutNextEvent();
    }
    
    private timeoutNextEvent() {
        // if there is more left in the 
        if (this.events.length > 0) { 
            const timeout = this.events[0].fight.time - (nodePerformanceNow() - this.fightStartTime);

            this.timeout = setTimeout(
                () => {
                    this.timeout = null;
                    this.nextEvent();
                },
                timeout > 0 ? timeout : 0
            );
        } else {
            this.timeout = setTimeout(
                () => {
                    this.timeout = null;
                    this.checkQueue();
                },
                this.settings.delayBetweenFights
            );
        }
    }

    //plays next fight event and queues the one after
    private nextEvent() {
        const event = this.events.shift();

        if (event === undefined) {
            console.error('no events left in fight');
            return;
        }
        applyFightEvents(this.combatants, event.fight);
        this.timeoutNextEvent();
    }

    // push the current events to everyone
    private pushLastResults(patchTime?: number, fan?: number) {
        const graphics: graphicsEvents.Event[] = [];
        this.events.forEach(e => graphics.push(...e.graphics));
        sortGraphicsEvents(graphics);

        if (fan && this.combatants[0])
            console.log('------------------------>  sending profile image url:', this.combatants[0].profileImageURL);

        this.sendMessageToFont(
            {
                newReel: {
                        characters: this.combatants.map(c => ({
                            name: c.name,
                            maxHitPoints: Math.floor(c.baseStats.maxHitPoints),
                            currentHitPoints: Math.floor(c.hitPoints),
                            art: c.character,
                            profileImageURL: c.profileImageURL,
                            bossMessage: c.bossMessage,
                            card: c.card
                        })
                    ),
                    reel: graphics,
                    patch: patchTime
                },
                queue: { queue: this.queue.map(s => ({
                    fanDisplayName: s.name, 
                    championTypeName: characters[s.character].name
                }))},
                characterList: fan ? cardStats : undefined
            },
            fan
        );
    }
}
