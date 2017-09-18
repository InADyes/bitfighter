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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
    constructor(time, character, debuff) {
        super(time, 4, character);
        this.character = character;
        this.debuff = debuff;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CritEvent;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return characters; });
/* harmony export (immutable) */ __webpack_exports__["b"] = pickCharacter;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__buff__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_help__ = __webpack_require__(2);


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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
        rarity: 0,
        critDebuff: __WEBPACK_IMPORTED_MODULE_0__buff__["a" /* buffs */][0]
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
    return new __WEBPACK_IMPORTED_MODULE_1__shared_help__["a" /* Status */](donation.id, donation.name, pick, donation.amount, character.stats.maxHitPoints + donation.amount, level, {
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
    });
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Status {
    constructor(id, name, character, donation, hitPoints, level, baseStats) {
        this.id = id;
        this.name = name;
        this.character = character;
        this.donation = donation;
        this.hitPoints = hitPoints;
        this.level = level;
        this.baseStats = baseStats;
        this.buffs = [];
    }
    addEffect(expires, buff) {
        this.buffs.push({ expires: expires, buff: buff });
    }
    checkBuffs(time) {
        this.buffs = this.buffs.filter(buff => {
            buff.expires > time;
        });
    }
    clearBuffs() {
        this.buffs = [];
    }
    get stats() {
        let stats = Object.assign({}, this.baseStats);
        for (let buff of this.buffs) {
            let b = buff.buff;
            if (b.accuracy)
                stats.accuracy *= b.accuracy;
            if (b.dodge)
                stats.dodge *= b.dodge;
            if (b.attackSpeed) {
                stats.attackSpeed.min *= b.attackSpeed;
                stats.attackSpeed.max *= b.attackSpeed;
            }
            if (b.attackDamage) {
                stats.attackDamage.min *= b.attackDamage;
                stats.attackDamage.max *= b.attackDamage;
            }
            if (b.armor)
                stats.armor *= b.armor;
            if (b.regeneration)
                stats.regeneration *= b.regeneration;
            if (b.crit)
                stats.crit *= b.crit;
        }
        return stats;
    }
    set stats(stats) {
        this.baseStats = stats;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Status;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game__ = __webpack_require__(4);

document.addEventListener('DOMContentLoaded', function () {
    let newDonationButton = document.getElementById('new-donation');
    let nameInputNode = document.getElementById('donation-name');
    let idInputNode = document.getElementById('donation-id');
    let bitsInputNode = document.getElementById('donation-bits');
    let artInputNode = document.getElementById('donation-art');
    if (newDonationButton == null || nameInputNode == null || bitsInputNode == null) {
        console.error('missing DOM hook');
        return;
    }
    newDonationButton.addEventListener('click', element => {
        let id = Number(idInputNode.value);
        let name = nameInputNode.value;
        let amount = Number(bitsInputNode.value);
        let art = Number(artInputNode.value);
        idInputNode.value = String(id + 1);
        game.addCombatant({ id: id, name: name, amount: amount, character: art });
    });
    let game = new __WEBPACK_IMPORTED_MODULE_0__Game__["a" /* Game */](message => {
        localStorage.setItem('fight', JSON.stringify(message));
    });
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__buildDisplayReel__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_buildFightReel__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_characterPicker__ = __webpack_require__(1);



class Game {
    constructor(sendFightMessage, settings) {
        this.sendFightMessage = sendFightMessage;
        this.timeout = null;
        this.lastCombatants = [];
        this.lastResults = [];
        this.queue = [];
        this.settings = {
            delayBetweenFights: 3000,
            gameSpeedMultipier: 1
        };
        if (settings)
            this.settings = settings;
    }
    addCombatant(donation) {
        this.queue.push(Object(__WEBPACK_IMPORTED_MODULE_2__shared_characterPicker__["b" /* pickCharacter */])(donation));
        console.log('new combatant added to queue');
        this.nextFight();
    }
    nextFight() {
        let fight;
        let display;
        if (this.timeout != null) {
            console.log('cannot start fight: fight already in progress');
            return;
        }
        if (this.lastResults.length + this.queue.length < 2) {
            console.log('cannot start fight: not enough combatants');
            return;
        }
        this.lastCombatants = this.lastResults.concat(this.queue.splice(0, 2 - this.lastResults.length));
        let result = Object(__WEBPACK_IMPORTED_MODULE_1__shared_buildFightReel__["a" /* buildFightReel */])(this.lastCombatants);
        result.reel.forEach(e => e.time *= this.settings.gameSpeedMultipier);
        this.lastResults = result.combatants;
        display = __WEBPACK_IMPORTED_MODULE_0__buildDisplayReel__["a" /* build */](result.reel);
        let frontCharacterInfo = [];
        for (let c of this.lastCombatants) {
            frontCharacterInfo.push({
                name: c.name,
                hitPoints: c.hitPoints
            });
        }
        this.sendFightMessage({ characters: frontCharacterInfo, reel: display });
        console.log('new fight: ', this);
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.nextFight();
        }, display[display.length - 1].time + this.settings.delayBetweenFights);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (immutable) */ __webpack_exports__["a"] = build;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_fightReel__ = __webpack_require__(0);


function otherCharacter(char) {
    switch (char) {
        case 0:
            return 1;
        case 1:
            return 0;
        default:
            console.error('bad character');
            process.exit();
            return -1;
    }
}
function build(fight) {
    let display = [];
    for (let event of fight) {
        switch (event.type) {
            case 0:
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["d" /* Health */](event.time, event.character, -event.amount));
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["e" /* Text */](event.time, event.character, String(event.amount), 'red'));
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["a" /* Attack */](event.time - 150, otherCharacter(event.character)));
                break;
            case 1:
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["e" /* Text */](event.time, event.character, 'dodge', 'orange'));
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["a" /* Attack */](event.time - 150, otherCharacter(event.character)));
                break;
            case 3:
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["d" /* Health */](event.time, event.character, -event.amount));
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["e" /* Text */](event.time, event.character, String(event.amount), 'red'));
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["a" /* Attack */](event.time - 150, otherCharacter(event.character)));
                break;
            case 2:
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["c" /* Clear */](event.time, event.character));
                break;
            case 4:
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["e" /* Text */](event.time, event.character, 'crit', 'red'));
                display.push(new __WEBPACK_IMPORTED_MODULE_0__shared_displayReel__["b" /* Buff */](event.time, event.character, event.debuff.art, event.debuff.duration));
                break;
            default:
                console.error('bad event type');
                process.exit();
        }
    }
    display.sort((a, b) => {
        return a.time - b.time;
    });
    return display;
}

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Event {
    constructor(time, type, character) {
        this.time = time;
        this.type = type;
        this.character = character;
    }
}
/* unused harmony export Event */

class Health extends Event {
    constructor(time, character, health) {
        super(time, 0, character);
        this.health = health;
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = Health;

class Attack extends Event {
    constructor(time, character) {
        super(time, 1, character);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Attack;

class Clear extends Event {
    constructor(time, character) {
        super(time, 2, character);
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = Clear;

class Text extends Event {
    constructor(time, character, text, color) {
        super(time, 3, character);
        this.text = text;
        this.color = color;
    }
}
/* harmony export (immutable) */ __webpack_exports__["e"] = Text;

class Buff extends Event {
    constructor(time, character, art, duration) {
        super(time, 4, character);
        this.art = art;
        this.duration = duration;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Buff;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = buildFightReel;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fightReel__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Combatant__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_help__ = __webpack_require__(2);



function buildFightReel(stats) {
    let everyoneAlive = true;
    const reel = [];
    const combatants = stats.map((s, index) => new __WEBPACK_IMPORTED_MODULE_1__Combatant__["a" /* Combatant */](new __WEBPACK_IMPORTED_MODULE_2__shared_help__["a" /* Status */](s.id, s.name, s.character, s.donation, s.hitPoints, s.level, s.baseStats), index, event => {
        reel.push(event);
        if (event.type == 2)
            everyoneAlive = false;
    }, (caller, damage, accuracy, crit, debuff) => {
        let opponents = combatants.filter(c => c != caller);
        opponents[0].takeHit(damage, accuracy, crit, debuff);
    }));
    if (combatants.length < 2) {
        console.error('not enough combatants to fight');
        return { combatants: combatants.map(c => c.status), reel };
    }
    while (everyoneAlive) {
        if (combatants[0].time <= combatants[1].time)
            combatants[0].attack();
        else
            combatants[1].attack();
    }
    combatants.forEach(c => c.status.clearBuffs());
    return { combatants: combatants.filter(c => c.isDead() == false).map(c => c.status), reel };
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fightReel__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__characterPicker__ = __webpack_require__(1);


class Combatant {
    constructor(status, index, newEvent, attackEvent) {
        this.status = status;
        this.index = index;
        this.newEvent = newEvent;
        this.attackEvent = attackEvent;
        this.time = 0;
        this.rollAttackSpeed();
    }
    rollAttackSpeed() {
        this.time += Math.ceil(Math.random() * (this.status.stats.attackSpeed.max - this.status.stats.attackSpeed.min)) + this.status.stats.attackSpeed.min;
    }
    attack() {
        this.status.checkBuffs(this.time);
        const stats = this.status.stats;
        this.rollAttackSpeed();
        const damageRoll = Math.ceil(Math.random() * (stats.attackDamage.max - stats.attackDamage.min)) + stats.attackDamage.min;
        this.attackEvent(this, damageRoll, stats.accuracy, stats.crit, __WEBPACK_IMPORTED_MODULE_1__characterPicker__["a" /* characters */][this.status.character].critDebuff);
    }
    takeHit(damage, accuracy, critChance, critDebuff) {
        this.status.checkBuffs(this.time);
        let total;
        let roll;
        total = accuracy + this.status.stats.dodge;
        roll = Math.ceil(Math.random() * total);
        if (roll > accuracy) {
            this.newEvent(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["d" /* DodgeEvent */](this.time, this.index));
            return;
        }
        roll = Math.ceil(Math.random() * 100);
        if (roll >= critChance) {
            damage = damage * 3 - this.status.stats.armor;
            this.status.addEffect(this.time + critDebuff.duration, critDebuff);
            this.newEvent(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["a" /* CritEvent */](this.time, this.index, critDebuff));
        }
        else
            damage -= this.status.stats.armor;
        if (damage < 0)
            damage = 0;
        else if (damage > this.status.hitPoints)
            damage = this.status.stats.maxHitPoints;
        this.status.hitPoints -= damage;
        this.newEvent(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["b" /* DamageEvent */](this.time, this.index, damage));
        if (this.status.hitPoints <= 0) {
            this.newEvent(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["c" /* DeathEvent */](this.time, this.index));
        }
    }
    heal() {
        this.status.checkBuffs(this.time);
        let healingAmount = this.status.stats.regeneration * 1000;
        if (healingAmount + this.status.hitPoints > 1000)
            healingAmount = 1000 - this.status.hitPoints;
        this.status.hitPoints += this.status.stats.regeneration * 1000;
        this.newEvent(new __WEBPACK_IMPORTED_MODULE_0__fightReel__["e" /* HealingEvent */](this.time, this.index, healingAmount));
    }
    isDead() {
        if (this.status.hitPoints <= 0)
            return true;
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Combatant;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const buffs = [
    {
        duration: 3000,
        art: 0,
        accuracy: 0.25,
        dodge: 0.25,
        attackSpeed: 0.25,
        attackDamage: 0.25,
        armor: 0.25,
        regeneration: 0.25,
        crit: 0.25
    }
];
/* harmony export (immutable) */ __webpack_exports__["a"] = buffs;



/***/ })
/******/ ]);
//# sourceMappingURL=settings.bundle.js.map