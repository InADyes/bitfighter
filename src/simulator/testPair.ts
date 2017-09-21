import * as characterPicker from '../shared/characterPicker';
import * as Fight from '../shared/fight';
import * as FightEvents from '../shared/fightEvents';
import { otherCharacter as other } from '../shared/utility';
import { Status } from '../shared/Status';

class Results {
    hits = 0;
    miss = 0;
    total_damage = 0;
    crits = 0;
    wins = 0;
    losses = 0;

    constructor(
        public readonly classType: number,
        public readonly bits: number
    ) {}

    get average_damage() {
        return this.total_damage / ( this.hits + this.miss );
    }
}

export function testPair(
    chars: Status[],
    fights: number
) {
    let results = chars.map(s => new Results(
        s.character,
        s.initialDonation
    ));

    for (let i = 0; i < fights; i++) {
        const {reel} = Fight.buildFightEvents(chars);

        for (const event of reel) {
            switch (event.type) {
                case FightEvents.Types.damage:
                    results[other(event.character)].total_damage += (<FightEvents.Damage>event).amount;
                    results[other(event.character)].hits++;
                    break;
                case FightEvents.Types.dodge:
                    results[other(event.character)].miss++;
                    break;
                case FightEvents.Types.healing:
                    break;
                case FightEvents.Types.death:
                    results[event.character].losses++;
                    results[other(event.character)].wins++;
                    break;
                case FightEvents.Types.crit:
                    results[other(event.character)].crits++;
                    break;
                default:
                    break;
            }
        }
    }
    return results;
}