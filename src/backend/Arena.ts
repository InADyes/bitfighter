import { characterSheets } from '../shared/globals/characterSheets';
import { hrtime } from 'process';

import { applyFightEvents } from '../shared/applyFightEvents';
import { sortGraphicsEvents } from '../shared/buildGraphicsEvents';
import { pickCharacter } from '../shared/characterPicker';
import { Combatant } from '../shared/Combatant';
import { fight } from '../shared/fight';
import { ReelMessage } from '../shared/interfaces/backToFrontMessage';
import { FightEvent } from '../shared/interfaces/fightEvents';
import { GraphicsEvent } from '../shared/interfaces/graphicsEvents';
import { Character, CombinedEvent, Donation } from '../shared/interfaces/interfaces';
import { Source } from '../shared/interfaces/source';
import { generateBitBoss } from './generateBitBoss';
import { BackendSettings } from './interfaces';

/**
 * Re-implementation of performanceNow() for node.
 */
function nodePerformanceNow() {
    if (hrtime) {
        const time = hrtime();
        return time[0] * 1e3 + time[1] / 1e6;
    }
    return performance.now();
};

/**
 * manages fights 
 */
export class Arena {
    private fightStartTime: number = 0;
    private timeout: NodeJS.Timer | null = null;
    public readonly combatants: Combatant[] = [];
    public results: Combatant[] = [];
    private events: Readonly<CombinedEvent>[] = [];

    constructor(
        public settings: BackendSettings,
        private readonly newFightResults: (message: ReelMessage, timer?: number) => void,
        private readonly fightOver: () => void,
        private readonly characterSheets: Character[]
    ) {}

    public clearTimeouts() {
        if (this.timeout) {
            global.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    public bossKill() {
        if (this.combatants.length < 1)
            return;
        this.combatants.splice(0, 1);
        this.startFight();
    }

    public addCombatants(countdown: number, ...combatants: Combatant[]) {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        this.combatants.push(...combatants);
        this.startFight({countdown});
    }

    public startFight(options: {countdown?: number, baseReel?: FightEvent[]} = {}) {
        const tempCombatant = this.combatants.map(s => s.clone());
        const combinedBase = applyFightEvents(tempCombatant, ...(options.baseReel || []))

        const result = fight(tempCombatant, {startTime: options.countdown});
        this.results = result.combatants;
        this.fightStartTime = nodePerformanceNow();
        this.events = combinedBase.concat(result.reel);

        this.pushLastResults({countdown: options.countdown});
        if (this.timeout)
            clearTimeout(this.timeout);
        this.playEvents();
    }

    public searchForCombatant(id: string) {
        return this.combatants.findIndex(s => s.id === id);
    }
    
    public healCombatant(targetID: string, donation: Donation) {
        const patchTime = nodePerformanceNow() - this.fightStartTime;
        const amount = this.settings.donationToHPRatio * donation.amount;
        const source: Source = {
            type: 'donation',
            donation
        };

        this.insertEvents(
            patchTime,
            source,
            {
                type: 'heal',
                time: patchTime,
                targetID,
                amount,
                source
            }
        );
    }

    public damageCombatant(index: number, donation: Donation) {
        if (this.combatants[index] === undefined) {
            console.log(`combatant with index ${ index } does not exist`);
            return;
        }

        const patchTime = nodePerformanceNow() - this.fightStartTime;
        
        const combatant = this.combatants[index];
        const amount = this.settings.donationToHPRatio * donation.amount;
        const source: Source = {
            type: 'donation',
            donation
        };

        this.insertEvents(
            patchTime,
            source,
            {
                type: 'damage',
                time: patchTime,
                targetID: this.combatants[0].id,
                amount,
                source
            }
        )
    }

    /**
     * builds  ReelMessage from current state
     */
    public buildReelMessage(patchTime?: number): ReelMessage {
        const graphics: GraphicsEvent[] = [];
        this.events.forEach(e => graphics.push(...e.graphics));
        sortGraphicsEvents(graphics);

        return {
            characters: this.combatants.map(c => ({
                name: c.name,
                maxHitPoints: Math.ceil(c.baseStats.maxHitPoints),
                currentHitPoints: Math.ceil(c.hitPoints),
                art: c.character.artPath,
                profileImageURL: c.profileImageURL,
                bossMessage: c.bossMessage,
                card: c.card,
                bossEmoticonURL: c.bossEmoticonURL,
                className: c.className,
                id: c.id
            })),
            reel: graphics,
            patch: patchTime
        }
    }
    
    /**
     * Pushes the current reel to everyone.
     */
    public pushLastResults(options?: {countdown?: number, patchTime?: number}) {
        this.newFightResults(
            this.buildReelMessage(
                options ? options.patchTime : undefined
            ),
            options ? options.countdown : undefined
        );
    }
    
    /**
     * Insert events into the current fight and genrate a new reel.
     * Only works when all new events have the same time.
     */
    public insertEvents(patchTime: number, source: Source, ...insert: FightEvent[]) {

        // create a temporary copy of combatant
        const tempCombatant = this.combatants.map(s => s.clone());

        // apply new events
        const reel = applyFightEvents(tempCombatant, ...insert);
        
        // calculate the results of the new events
        reel.push(...fight(tempCombatant, {startTime: patchTime, source}).reel);

        // if the new events caused the chapion to die instead start a fight
        if (
            this.settings.bitFighterEnabled
            && this.combatants.length === 1
            && reel.some(e => e.fight.type === 'death')
            && source.type === 'donation'
        ) {
            this.combatants.push(pickCharacter(
                source.donation,
                characterSheets.find(c => c.rarity === 'graveDigger') || characterSheets[0]
            ));
            this.startFight({
                baseReel: [{
                    type: 'heal',
                    time: 0,
                    targetID: this.combatants[0].id,
                    amount: this.combatants[0].stats.maxHitPoints * 0.1,
                    source: {type: 'game'}
                }]
            });
            return;
        }
        this.events = reel;

        this.pushLastResults({patchTime});
        
        if (this.timeout)
            clearTimeout(this.timeout);
        this.playEvents();
    }
    
    /**
     * Plays events until the timeout is cleared or there are no more events
     */
    private playEvents() {
        // if there is more left in the 
        if (this.events.length > 0) { 
            const timeout = this.events[0].fight.time - (nodePerformanceNow() - this.fightStartTime);

            this.timeout = global.setTimeout(
                () => {
                    this.timeout = null;
                    this.applyNextEvent();
                    this.playEvents();
                },
                timeout > 0 ? timeout : 0
            );
        } else {
            this.timeout = global.setTimeout(
                () => {
                    this.timeout = null;
                    this.fightOver();
                },
                this.settings.delayBetweenFights
            );
        }
    }

    /**
     * Plays the next event. If the event was a death caused by a donatoin then generate a new bitboss.
     */
    private applyNextEvent() {
        const event = this.events.shift();

        if (event === undefined) {
            console.error('no events left in fight');
            return;
        }
        applyFightEvents(this.combatants, event.fight);

        // if the boss was killed by a damage donation they become the bitBoss
        if (
            event.fight.type === 'death'
            && this.combatants.length === 0
            && event.fight.source.type === 'donation'
        ) {
            this.combatants.push(generateBitBoss(
                event.fight.source.donation,
                this.characterSheets,
                this.settings.bitBossStartingHealth + event.fight.overkill
            ));
            this.results = this.combatants;
            this.pushLastResults();
        }
    }

    public isBusy(): boolean {
        return this.timeout !== null;
    }
}
