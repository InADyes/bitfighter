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
/* unused harmony export Event */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DamageEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return DodgeEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DeathEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return HealingEvent; });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Event = (function () {
    function Event(timeout, type, character) {
        this.timeout = timeout;
        this.type = type;
        this.character = character;
    }
    ;
    return Event;
}());

var DamageEvent = (function (_super) {
    __extends(DamageEvent, _super);
    function DamageEvent(timeout, character, amount) {
        var _this = _super.call(this, timeout, 0, character) || this;
        _this.amount = amount;
        return _this;
    }
    return DamageEvent;
}(Event));

var DodgeEvent = (function (_super) {
    __extends(DodgeEvent, _super);
    function DodgeEvent(timeout, character) {
        return _super.call(this, timeout, 1, character) || this;
    }
    return DodgeEvent;
}(Event));

var DeathEvent = (function (_super) {
    __extends(DeathEvent, _super);
    function DeathEvent(timeout, character) {
        return _super.call(this, timeout, 2, character) || this;
    }
    return DeathEvent;
}(Event));

var HealingEvent = (function (_super) {
    __extends(HealingEvent, _super);
    function HealingEvent(timeout, character, amount) {
        var _this = _super.call(this, timeout, 3, character) || this;
        _this.amount = amount;
        return _this;
    }
    return HealingEvent;
}(Event));



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_process__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_process___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_process__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Fight__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ClassPicker__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__FightReel__ = __webpack_require__(0);




console.log(__WEBPACK_IMPORTED_MODULE_0_process__["argv"]);
var Results = (function () {
    function Results(classType, bits) {
        this.classType = classType;
        this.bits = bits;
        this.hits = 0;
        this.miss = 0;
        this.total_damage = 0;
        this.crits = 0;
        this.wins = 0;
        this.losses = 0;
    }
    Object.defineProperty(Results.prototype, "average_damage", {
        get: function () {
            return this.total_damage / (this.wins + this.losses);
        },
        enumerable: true,
        configurable: true
    });
    return Results;
}());
var results = [
    new Results(Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][2]), Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][3])),
    new Results(Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][4]), Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][5]))
];
var chars = [
    Object(__WEBPACK_IMPORTED_MODULE_2__ClassPicker__["a" /* pickCharacter */])({
        id: 0,
        name: 'shawn',
        amount: results[0].bits,
        art: results[0].classType
    }),
    Object(__WEBPACK_IMPORTED_MODULE_2__ClassPicker__["a" /* pickCharacter */])({
        id: 1,
        name: 'hao',
        amount: results[1].bits,
        art: results[1].classType
    })
];
var fights = Number(__WEBPACK_IMPORTED_MODULE_0_process__["argv"][6]);
console.log('fights', fights);
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
for (var i = 0; i < fights; i++) {
    var reel = __WEBPACK_IMPORTED_MODULE_1__Fight__["a" /* buildFightReel */]([chars[0], chars[1]]);
    if (reel == undefined) {
        __WEBPACK_IMPORTED_MODULE_0_process__["exit"]();
        break;
    }
    for (var _i = 0, _a = reel.reel; _i < _a.length; _i++) {
        var event_1 = _a[_i];
        switch (event_1.type) {
            case 0:
                results[other(event_1.character)].total_damage += event_1.amount;
                results[other(event_1.character)].hits++;
                break;
            case 1:
                results[other(event_1.character)].miss++;
                break;
            case 3:
                break;
            case 2:
                results[event_1.character].losses++;
                results[other(event_1.character)].wins++;
                break;
            default:
                console.log('bad event type');
                __WEBPACK_IMPORTED_MODULE_0_process__["exit"]();
        }
    }
}
console.log(results);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("process");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = buildFightReel;
/* unused harmony export Combatant */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FightReel__ = __webpack_require__(0);

function buildFightReel(combatants) {
    var everyoneAlive = true;
    var time = 0;
    var reel = [];
    var c = combatants.map(function (combatant) { return new Combatant(combatant, function (caller) {
        reel.push(new __WEBPACK_IMPORTED_MODULE_0__FightReel__["b" /* DeathEvent */](caller.time, c.indexOf(caller)));
        everyoneAlive = false;
    }, function (caller, damage, accuracy) {
        var opponents = c.filter(function (c) { return c != caller; });
        opponents[0].takeHit(damage, accuracy);
    }, function (caller) {
        reel.push(new __WEBPACK_IMPORTED_MODULE_0__FightReel__["c" /* DodgeEvent */](caller.time, c.indexOf(caller)));
    }, function (caller, damage) {
        reel.push(new __WEBPACK_IMPORTED_MODULE_0__FightReel__["a" /* DamageEvent */](caller.time, c.indexOf(caller), damage));
    }, function (caller, healing) {
        reel.push(new __WEBPACK_IMPORTED_MODULE_0__FightReel__["d" /* HealingEvent */](caller.time, c.indexOf(caller), healing));
    }); });
    if (combatants.length < 2) {
        console.error('not enough combatants to fight');
        return;
    }
    while (everyoneAlive) {
        if (c[0].time < c[0].time)
            c[0].attack();
        else
            c[1].attack();
    }
    return { combatants: c.filter(function (c) { return c.isDead() == false; }).map(function (c) { return c.status; }), reel: reel };
}
var Combatant = (function () {
    function Combatant(status, deathEvent, attackEvent, dodgeEvent, damageEvent, healingEvent) {
        this.status = status;
        this.deathEvent = deathEvent;
        this.attackEvent = attackEvent;
        this.dodgeEvent = dodgeEvent;
        this.damageEvent = damageEvent;
        this.healingEvent = healingEvent;
        this.time = 0;
    }
    Combatant.prototype.getID = function () {
        return this.status.id;
    };
    Combatant.prototype.attack = function () {
        this.time += this.status.stats.attackSpeed;
        this.attackEvent(this, this.status.stats.attackDamage, this.status.stats.accuracy);
    };
    Combatant.prototype.takeHit = function (damage, accuracy) {
        var total;
        var roll;
        total = accuracy + this.status.stats.dodge;
        roll = Math.ceil(Math.random() * total);
        if (roll > accuracy) {
            console.log(this.status.name + ' ' + this.status.id + ' dodged the attack! =D');
            this.dodgeEvent(this);
            return;
        }
        console.log(this.status.name + ' ' + this.status.id + ' was hit! Yikes!!! >_<');
        damage -= this.status.stats.armor;
        if (damage < 0)
            damage = 0;
        else if (damage > this.status.hitPoints)
            damage = this.status.stats.maxHitPoints;
        this.status.hitPoints -= damage;
        this.damageEvent(this, damage);
        console.log(this.status.name + ' ' + this.status.id + ' Has taken ' + damage + '! :(');
        if (this.status.hitPoints <= 0) {
            console.log(this.status.name + ' ' + this.status.id + ' Has been slain! Their body lies motionless on the floor... ;-;');
            this.deathEvent(this);
        }
    };
    Combatant.prototype.heal = function () {
        var healingAmount = this.status.stats.regeneration * 1000;
        if (healingAmount + this.status.hitPoints > 1000)
            healingAmount = 1000 - this.status.hitPoints;
        this.status.hitPoints += this.status.stats.regeneration * 1000;
        this.healingEvent(this, healingAmount);
    };
    Combatant.prototype.isDead = function () {
        if (this.status.hitPoints <= 0)
            return true;
        return false;
    };
    return Combatant;
}());



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = pickCharacter;
;
;
var characters = [
    {
        hitPoints: { base: 1000, scaler: 0 },
        accuracy: { base: 0, scaler: 1 },
        dodge: { base: 10, scaler: 1 },
        attackSpeed: { base: 1300, scaler: 0 },
        attackDamage: { base: 100, scaler: 0 },
        armor: { base: 40, scaler: 0 },
        regeneration: { base: 0.2, scaler: 0 },
        spriteUrl: 'images/characters/sword.png'
    },
    {
        hitPoints: { base: 1000, scaler: 0 },
        accuracy: { base: 0, scaler: 1 },
        dodge: { base: 5, scaler: 1 },
        attackSpeed: { base: 1750, scaler: 0 },
        attackDamage: { base: 150, scaler: 0 },
        armor: { base: 45, scaler: 0 },
        regeneration: { base: 0.2, scaler: 0 },
        spriteUrl: 'images/characters/daggers.png'
    },
    {
        hitPoints: { base: 1000, scaler: 0 },
        accuracy: { base: 0, scaler: 1 },
        dodge: { base: 0, scaler: 1 },
        attackSpeed: { base: 2250, scaler: 0 },
        attackDamage: { base: 185, scaler: 0 },
        armor: { base: 60, scaler: 0 },
        regeneration: { base: 0.2, scaler: 0 },
        spriteUrl: 'images/characters/axe.png'
    }
];
function pickCharacter(donation) {
    var pick = donation.art % characters.length;
    var character = characters[pick];
    return {
        id: donation.id,
        name: donation.name,
        donation: donation.amount,
        hitPoints: character.hitPoints.base + character.hitPoints.scaler * donation.amount,
        art: pick,
        stats: {
            maxHitPoints: character.hitPoints.base + character.hitPoints.scaler * donation.amount,
            accuracy: character.accuracy.base + character.accuracy.scaler * donation.amount,
            dodge: character.dodge.base + character.dodge.scaler * donation.amount,
            attackSpeed: character.attackSpeed.base + character.attackSpeed.scaler * donation.amount,
            attackDamage: character.attackDamage.base + character.attackDamage.scaler * donation.amount,
            armor: character.armor.base + character.armor.scaler * donation.amount,
            regeneration: character.regeneration.base + character.regeneration.scaler * donation.amount
        }
    };
}


/***/ })
/******/ ]);
//# sourceMappingURL=simulator.js.map