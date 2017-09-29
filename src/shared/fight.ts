import * as FightEvents from './fightEvents';
import { Combatant } from './Combatant';
import { Status } from '../shared/Status';
import { applyFightEvents } from './applyFightEvents';
import { otherCharacter  as other} from './utility';
import { buffs, types as buffTypes } from './buff';

export function buildFightEvents(stats: Status[]) {
    const reel: FightEvents.Event[] = [];

    const newStats = stats.map(s => new Status(
            s.id, //getto deep clone
            s.name,
            s.character,
            s.initialDonation,
            s.hitPoints,
            s.level,
            s.baseStats,
            s.profileImageURL,
            s.chatMessage
    ));

    const combatants = newStats.map((s, index) => new Combatant(
        s,
        index,
        event => {
            applyFightEvents(newStats, event);
            reel.push(event);
        },
        (attack) => {
            let opponents = combatants.filter(c => c != attack.attacker);
            opponents[0].takeHit(attack);
        }
    ));

    if (combatants.length < 2) {
        console.log('not enough combatants to fight');
        return {combatants: stats, reel};
    }
    // ------------- type hack starts here

    if (typeMap[newStats[0].character] === 0 && typeMap[newStats[1].character] === 2)
        newStats[0].addEffect(10000000, buffs[buffTypes.armorBonus]);
        
    if (typeMap[newStats[0].character] === 1 && typeMap[newStats[1].character] === 0)
        newStats[0].addEffect(10000000, buffs[buffTypes.armorBonus]);

    if (typeMap[newStats[0].character] === 2 && typeMap[newStats[1].character] === 1)
        newStats[0].addEffect(10000000, buffs[buffTypes.armorBonus]);

    if (typeMap[newStats[1].character] === 0 && typeMap[newStats[0].character] === 2)
        newStats[1].addEffect(10000000, buffs[buffTypes.armorBonus]);

    if (typeMap[newStats[1].character] === 1 && typeMap[newStats[0].character] === 0)
        newStats[1].addEffect(10000000, buffs[buffTypes.armorBonus]);

    if (typeMap[newStats[1].character] === 2 && typeMap[newStats[0].character] === 1)
        newStats[1].addEffect(10000000, buffs[buffTypes.armorBonus]);


    // ---------- end here
    while (newStats.length >= 2) {
        if (combatants[0].time <= combatants[1].time)
            combatants[0].attack();
        else
            combatants[1].attack();
    }

    newStats.forEach(s => s.clearBuffs());
    let winner = combatants.filter(c => c.status == newStats[0])[0];
    winner.time += 1000;
    winner.heal(); //todo: maybe should be done in front end

    return { combatants: newStats, reel }
}

const enum types {
    holy,
    magic,
    physical
}

const typeMap = [
    types.physical, // Scullery Maid
    types.physical, // Barkeep
    types.holy,     // Medium
    types.magic,    // Minstrel
    types.magic,    // Mage
    types.physical, // Rogue
    types.holy,     // Warpriest
    types.magic,    // Warlock
    types.physical, // Swashbuckler
    types.magic,    // Dragon
]
