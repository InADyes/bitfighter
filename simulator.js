/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Event {
    constructor(time, type, character) {
        this.time = time;
        this.type = type;
        this.character = character;
    }
    ;
}
/* unused harmony export Event */

class DamageEvent extends Event {
    constructor(time, character, amount) {
        super(time, 0, character);
        this.amount = amount;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = DamageEvent;

class DodgeEvent extends Event {
    constructor(time, character) {
        super(time, 1, character);
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = DodgeEvent;

class DeathEvent extends Event {
    constructor(time, character) {
        super(time, 2, character);
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = DeathEvent;

class HealingEvent extends Event {
    constructor(time, character, amount) {
        super(time, 3, character);
        this.amount = amount;
    }
}
/* harmony export (immutable) */ __webpack_exports__["e"] = HealingEvent;

class CritEvent extends Event {
    constructor(time, character, type) {
        super(time, 4, character);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CritEvent;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_process__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_process___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_process__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_fight__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_characterPicker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_fightReel__ = __webpack_require__(0);




class Results {
    constructor(classType, bits) {
        this.classType = classType;
        this.bits = bits;
        this.hits = 0;
        this.miss = 0;
        this.total_damage = 0;
        this.crits = 0;
        this.wins = 0;
        this.losses = 0;
    }
    get average_damage() {
        return this.total_damage / (this.hits + this.miss);
    }
}
let results = [
    new Results(Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][2]), Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][3])),
    new Results(Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][4]), Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][5]))
];
let chars = [
    Object(__WEBPACK_IMPORTED_MODULE_2__shared_characterPicker__["a" /* pickCharacter */])({
        id: 0,
        name: 'shawn',
        amount: results[0].bits,
        character: results[0].classType
    }),
    Object(__WEBPACK_IMPORTED_MODULE_2__shared_characterPicker__["a" /* pickCharacter */])({
        id: 1,
        name: 'hao',
        amount: results[1].bits,
        character: results[1].classType
    })
];
let fights = Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][6]);
function other(char) {
    switch (char) {
        case 0:
            return 1;
        case 1:
            return 0;
        default:
            console.error('bad character');
            __WEBPACK_IMPORTED_MODULE_0_process__["exit"]();
            return -1;
    }
}
for (let i = 0; i < fights; i++) {
    let reel = __WEBPACK_IMPORTED_MODULE_1__shared_fight__["a" /* buildFightReel */]([chars[0], chars[1]]);
    if (reel == undefined) {
        __WEBPACK_IMPORTED_MODULE_0_process__["exit"]();
        break;
    }
    for (let event of reel.reel) {
        switch (event.type) {
            case 0:
                results[other(event.character)].total_damage += event.amount;
                results[other(event.character)].hits++;
                break;
            case 1:
                results[other(event.character)].miss++;
                break;
            case 3:
                break;
            case 2:
                results[event.character].losses++;
                results[other(event.character)].wins++;
                break;
            case 4:
                results[other(event.character)].crits++;
                break;
            default:
                console.log('bad event type');
                __WEBPACK_IMPORTED_MODULE_0_process__["exit"]();
        }
    }
}
console.log(`classType, ${results[0].classType}, ${results[1].classType}`);
console.log(`hits, ${results[0].hits}, ${results[1].hits}`);
console.log(`miss, ${results[0].miss}, ${results[1].miss}`);
console.log(`total_damage, ${results[0].total_damage}, ${results[1].total_damage}`);
console.log(`crits, ${results[0].crits}, ${results[1].crits}`);
console.log(`wins, ${results[0].wins}, ${results[1].wins}`);
console.log(`losses, ${results[0].losses}, ${results[1].losses}`);
console.log(`average_damage, ${results[0].average_damage}, ${results[1].average_damage}`);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("process");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = buildFightReel;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fightReel__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Combatant__ = __webpack_require__(4);


function buildFightReel(original) {
    const combatants = [];
    Object.assign(combatants, original);
    let everyoneAlive = true;
    const reel = [];
    const c = combatants.map((combatant) => new __WEBPACK_IMPORTED_MODULE_1__Combatant__["a" /* Combatant */](combatant, caller => {
        reel.push(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["c" /* DeathEvent */](caller.time, c.indexOf(caller)));
        everyoneAlive = false;
    }, (caller, damage, accuracy, crit) => {
        let opponents = c.filter(c => c != caller);
        opponents[0].takeHit(damage, accuracy, crit);
    }, caller => {
        reel.push(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["d" /* DodgeEvent */](caller.time, c.indexOf(caller)));
    }, (caller, damage) => {
        reel.push(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["b" /* DamageEvent */](caller.time, c.indexOf(caller), damage));
    }, (caller, healing) => {
        reel.push(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["e" /* HealingEvent */](caller.time, c.indexOf(caller), healing));
    }, (caller, type) => {
        reel.push(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["a" /* CritEvent */](caller.time, c.indexOf(caller), type));
    }));
    if (combatants.length < 2) {
        console.error('not enough combatants to fight');
        return { combatants: c.map(c => c.status), reel };
    }
    while (everyoneAlive) {
        if (c[0].time <= c[1].time)
            c[0].attack();
        else
            c[1].attack();
    }
    return { combatants: c.filter(c => c.isDead() == false).map(c => c.status), reel };
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Combatant {
    constructor(status, deathEvent, attackEvent, dodgeEvent, damageEvent, healingEvent, critEvent) {
        this.status = status;
        this.deathEvent = deathEvent;
        this.attackEvent = attackEvent;
        this.dodgeEvent = dodgeEvent;
        this.damageEvent = damageEvent;
        this.healingEvent = healingEvent;
        this.critEvent = critEvent;
        this.time = 0;
    }
    attack() {
        let stats = this.status.stats;
        this.time += Math.ceil(Math.random() * (stats.attackSpeed.max - stats.attackSpeed.min)) + stats.attackSpeed.min;
        let damageRoll = Math.ceil(Math.random() * (stats.attackDamage.max - stats.attackDamage.min)) + stats.attackDamage.min;
        this.attackEvent(this, damageRoll, stats.accuracy, stats.crit);
    }
    takeHit(damage, accuracy, crit) {
        let total;
        let roll;
        total = accuracy + this.status.stats.dodge;
        roll = Math.ceil(Math.random() * total);
        if (roll > accuracy) {
            this.dodgeEvent(this);
            return;
        }
        roll = Math.ceil(Math.random() * 100);
        if (roll <= crit) {
            damage = damage * 5;
            this.critEvent(this, 0);
        }
        damage -= this.status.stats.armor;
        if (damage < 0)
            damage = 0;
        else if (damage > this.status.hitPoints)
            damage = this.status.stats.maxHitPoints;
        this.status.hitPoints -= damage;
        this.damageEvent(this, damage);
        if (this.status.hitPoints <= 0) {
            this.deathEvent(this);
        }
    }
    heal() {
        let healingAmount = this.status.stats.regeneration * 1000;
        if (healingAmount + this.status.hitPoints > 1000)
            healingAmount = 1000 - this.status.hitPoints;
        this.status.hitPoints += this.status.stats.regeneration * 1000;
        this.healingEvent(this, healingAmount);
    }
    isDead() {
        if (this.status.hitPoints <= 0)
            return true;
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Combatant;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = pickCharacter;
let characters = [
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    },
    {
        stats: {
            maxHitPoints: 1000,
            accuracy: 50,
            dodge: 50,
            attackSpeed: {
                min: 1000,
                max: 1750,
            },
            attackDamage: {
                min: 25,
                max: 50,
            },
            armor: 20,
            regeneration: 200,
            crit: 20,
        },
        rarity: 0
    }
];
let rarityLevel = [
    1,
    3,
    5,
    7
];
;
let levels = [
    {
        bits: 200,
        accuracy: 0,
        dodge: 0,
    },
    {
        bits: 500,
        accuracy: 50,
        dodge: 50,
    }
];
function pickCharacter(donation) {
    let pick = donation.character % characters.length;
    let character = characters[pick];
    let level = rarityLevel[characters[pick].rarity];
    while (level < levels.length && donation.amount > levels[level].bits)
        level++;
    return {
        id: donation.id,
        name: donation.name,
        donation: donation.amount,
        hitPoints: character.stats.maxHitPoints + donation.amount,
        character: pick,
        stats: {
            maxHitPoints: character.stats.maxHitPoints + donation.amount,
            accuracy: character.stats.accuracy + levels[level - 1].accuracy,
            dodge: character.stats.dodge + levels[level - 1].dodge,
            attackSpeed: {
                min: character.stats.attackSpeed.min,
                max: character.stats.attackSpeed.max
            },
            attackDamage: {
                min: character.stats.attackDamage.min,
                max: character.stats.attackDamage.max
            },
            armor: character.stats.armor,
            regeneration: character.stats.regeneration,
            crit: character.stats.crit
        },
        level: level
    };
}


/***/ })
/******/ ]);
//# sourceMappingURL=simulator.js.map