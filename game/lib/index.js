"use strict";
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
var Actor = (function () {
    function Actor(ctx, pos) {
        this.ctx = ctx;
        this.pos = pos;
    }
    Actor.prototype.setPosition = function (pos) {
        this.pos = pos;
    };
    return Actor;
}());
var Combatant;
(function (Combatant_1) {
    var Combatant = (function (_super) {
        __extends(Combatant, _super);
        function Combatant(ctx, pos, id, name, icon, sprite, stats, deathEvent, attackEvent) {
            var _this = _super.call(this, ctx, pos) || this;
            _this.iconImage = new Image();
            _this.attCD = 0;
            _this.fighting = false;
            _this.id = id;
            _this.name = name;
            _this.iconImage.src = icon;
            _this.stats = stats;
            _this.healthBar = new HealthBar(ctx, {
                x: pos.x + Combatant.healthBarOffset.x,
                y: pos.y + Combatant.healthBarOffset.y
            });
            _this.sprite = new Sprite(ctx, { x: pos.x, y: pos.y }, sprite);
            _this.textOut = new TextOut(ctx, {
                x: pos.x + Combatant.textOutOffset.x,
                y: pos.y + Combatant.textOutOffset.y
            });
            _this.deathEvent = deathEvent;
            _this.attackEvent = attackEvent;
            return _this;
        }
        Combatant.prototype.toString = function () {
            return this.name;
        };
        Combatant.prototype.tick = function (timeDelta) {
            if (this.fighting) {
                this.attCD = this.attCD + timeDelta;
                if (this.attCD >= this.stats.attackSpeed - 150 && this.attCD - timeDelta <= this.stats.attackSpeed - 150) {
                    this.sprite.attackAnimation();
                }
                if (this.attCD >= this.stats.attackSpeed) {
                    this.attackEvent(this, this.stats.attackDamage, this.stats.accuracy);
                    this.attCD = this.attCD - this.stats.attackSpeed;
                }
            }
            this.healthBar.tick(timeDelta);
            this.sprite.tick(timeDelta);
            this.textOut.tick(timeDelta);
        };
        Combatant.prototype.draw = function () {
            this.ctx.fillStyle = 'black';
            this.ctx.strokeStyle = 'white';
            this.ctx.font = "14px Arial";
            this.ctx.lineWidth = 1;
            this.ctx.strokeText(this.name, this.pos.x + 25, this.pos.y + 122);
            this.ctx.fillText(this.name, this.pos.x + 25, this.pos.y + 122);
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.webkitImageSmoothingEnabled = false;
            this.ctx.mozImageSmoothingEnabled = false;
            this.ctx.drawImage(this.iconImage, this.pos.x, this.pos.y + 105);
            this.healthBar.draw();
            this.sprite.draw();
            this.textOut.draw();
        };
        Combatant.prototype.donate = function (amount) {
            this.stats.accuracy = this.stats.accuracy + amount;
            this.stats.dodge = this.stats.accuracy + amount;
            this.stats.hitPoints = this.stats.hitPoints + amount;
            this.healthBar.setHealth(this.stats.hitPoints);
        };
        Combatant.prototype.getID = function () {
            return this.id;
        };
        Combatant.prototype.fight = function () {
            this.fighting = true;
            this.attCD = this.stats.attackSpeed;
        };
        Combatant.prototype.wait = function () {
            this.fighting = false;
        };
        Combatant.prototype.getIcon = function () {
            return this.iconImage;
        };
        Combatant.prototype.setPosition = function (pos) {
            this.pos = pos;
            this.healthBar.setPosition({
                x: pos.x + Combatant.healthBarOffset.x,
                y: pos.y + Combatant.healthBarOffset.y
            });
            this.sprite.setPosition(this.pos);
            this.textOut.setPosition({
                x: pos.x + Combatant.textOutOffset.x,
                y: pos.y + Combatant.textOutOffset.y
            });
        };
        Combatant.prototype.takeHit = function (damage, accuracy) {
            var total;
            var roll;
            total = accuracy + this.stats.dodge;
            roll = Math.ceil(Math.random() * total);
            if (roll > this.stats.accuracy) {
                console.log(this.name + " " + this.id + " dodged the attack! =D");
                this.textOut.add('dodge', 'orange');
                return;
            }
            console.log(this.name + " " + this.id + " was hit! Yikes!!! >_<");
            damage -= this.stats.armor;
            if (damage < 0)
                damage = 0;
            this.stats.hitPoints -= damage;
            if (this.stats.hitPoints < 0)
                this.stats.hitPoints = 0;
            this.healthBar.setHealth(this.stats.hitPoints);
            console.log(this.name + " " + this.id + " Has taken " + damage + "! :(");
            this.textOut.add(String(damage), 'red');
            if (this.stats.hitPoints <= 0) {
                console.log(this.name + " " + this.id + " Has been slain! Their body lies motionless on the floor... ;-;");
                this.deathEvent(this);
            }
        };
        Combatant.prototype.heal = function () {
            this.stats.hitPoints += this.stats.regeneration * 1000;
            if (this.stats.hitPoints > 1000)
                this.stats.hitPoints = 1000;
            this.healthBar.setHealth(this.stats.hitPoints);
        };
        Combatant.prototype.setFacingDirection = function (left) {
            this.sprite.setFacingDirection(left);
        };
        Combatant.prototype.isDead = function () {
            if (this.stats.hitPoints <= 0)
                return true;
            return false;
        };
        Combatant.healthBarOffset = { x: 0, y: 130 };
        Combatant.textOutOffset = { x: 30, y: 0 };
        return Combatant;
    }(Actor));
    Combatant_1.Combatant = Combatant;
    var HealthBar = (function (_super) {
        __extends(HealthBar, _super);
        function HealthBar() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.targetHealth = 1000;
            _this.redHealth = 1000;
            _this.displayedYellow = 1000;
            return _this;
        }
        HealthBar.prototype.draw = function () {
            this.ctx.fillStyle = 'grey';
            this.ctx.fillRect(this.pos.x, this.pos.y, 1000 / HealthBar.healthToPixels, HealthBar.height);
            this.ctx.fillStyle = 'orange';
            this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.displayedYellow / HealthBar.healthToPixels), HealthBar.height);
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.redHealth / HealthBar.healthToPixels), HealthBar.height);
        };
        HealthBar.prototype.tick = function (timeDelta) {
            if (this.redHealth < this.displayedYellow) {
                this.displayedYellow -= timeDelta / HealthBar.yellowBarFollowRate;
                if (this.redHealth > this.displayedYellow)
                    this.displayedYellow = this.redHealth;
            }
            if (this.redHealth < this.targetHealth)
                this.redHealth += timeDelta / HealthBar.yellowBarFollowRate;
        };
        HealthBar.prototype.setHealth = function (health) {
            this.targetHealth = health;
            if (this.redHealth > this.targetHealth)
                this.redHealth = this.targetHealth;
        };
        HealthBar.yellowBarFollowRate = 7;
        HealthBar.healthToPixels = 15;
        HealthBar.height = 6;
        return HealthBar;
    }(Actor));
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(ctx, pos, sprite) {
            var _this = _super.call(this, ctx, pos) || this;
            _this.spriteImage = new Image();
            _this.countdown = 0;
            _this.facingLeft = false;
            _this.spriteImage.src = sprite;
            return _this;
        }
        Sprite.prototype.draw = function () {
            var offset = Math.floor(Math.sin(this.countdown) * Sprite.shakeAmplitude);
            if (this.facingLeft) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.webkitImageSmoothingEnabled = false;
                this.ctx.mozImageSmoothingEnabled = false;
                this.ctx.drawImage(this.spriteImage, this.facingLeft ? -(this.pos.x + 90 - offset) : -(this.pos.x + 90 + offset), this.pos.y);
                this.ctx.restore();
            }
            else {
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.webkitImageSmoothingEnabled = false;
                this.ctx.mozImageSmoothingEnabled = false;
                this.ctx.drawImage(this.spriteImage, this.facingLeft ? this.pos.x - offset : this.pos.x + offset, this.pos.y);
            }
        };
        Sprite.prototype.attackAnimation = function () {
            this.countdown = Sprite.countdownStart;
        };
        Sprite.prototype.tick = function (timeDelta) {
            this.countdown -= timeDelta / Sprite.timeToAmplitueRatio;
            if (this.countdown < 0)
                this.countdown = 0;
        };
        Sprite.prototype.setFacingDirection = function (left) {
            this.facingLeft = left;
        };
        Sprite.countdownStart = Math.PI;
        Sprite.shakeAmplitude = 10;
        Sprite.timeToAmplitueRatio = 75;
        return Sprite;
    }(Actor));
    var TextOut = (function (_super) {
        __extends(TextOut, _super);
        function TextOut() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.displayedText = [];
            return _this;
        }
        TextOut.prototype.tick = function (timeDelta) {
            this.displayedText.forEach(function (e) { return e.timeout += timeDelta; });
            this.displayedText = this.displayedText.filter(function (e) { return e.timeout < TextOut.timeout; });
        };
        TextOut.prototype.draw = function () {
            var _this = this;
            this.ctx.strokeStyle = 'black';
            this.ctx.font = "14px Arial";
            this.displayedText.forEach(function (e) {
                _this.ctx.fillStyle = e.color;
                _this.ctx.strokeText(e.text, _this.pos.x, _this.pos.y - e.timeout / TextOut.offsetRatio);
                _this.ctx.fillText(e.text, _this.pos.x, _this.pos.y - e.timeout / TextOut.offsetRatio);
            });
        };
        TextOut.prototype.add = function (text, color) {
            this.displayedText.push({ text: text, timeout: 0, color: color });
        };
        TextOut.timeout = 5000;
        TextOut.offsetRatio = 50;
        return TextOut;
    }(Actor));
})(Combatant || (Combatant = {}));
var ClassPicker;
(function (ClassPicker) {
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
        var character = characters[donation.art % characters.length];
        return {
            stats: {
                hitPoints: character.hitPoints.base + character.hitPoints.scaler * donation.amount,
                accuracy: character.accuracy.base + character.accuracy.scaler * donation.amount,
                dodge: character.dodge.base + character.dodge.scaler * donation.amount,
                attackSpeed: character.attackSpeed.base + character.attackSpeed.scaler * donation.amount,
                attackDamage: character.attackDamage.base + character.attackDamage.scaler * donation.amount,
                armor: character.armor.base + character.armor.scaler * donation.amount,
                regeneration: character.regeneration.base + character.regeneration.scaler * donation.amount
            },
            spriteUrl: character.spriteUrl
        };
    }
    ClassPicker.pickCharacter = pickCharacter;
})(ClassPicker || (ClassPicker = {}));
var Game;
(function (Game_1) {
    var iconArt = [
        'images/icons/cherries.png',
        'images/icons/banana.png',
        'images/icons/lime-icon.png',
        'images/icons/orange-icon.png'
    ];
    ;
    var Game = (function () {
        function Game(front, back) {
            this.arena = [];
            this.queue = [];
            this.lastTimestamp = performance.now();
            this.state = 0;
            this.timeout = 0;
            var frontCtx = front.getContext('2d');
            var backCtx = front.getContext('2d');
            if (frontCtx == null || backCtx == null) {
                console.error("could not get get canvas 2d context");
                return;
            }
            this.frontCtx = frontCtx;
            this.backCtx = backCtx;
            this.canvasSize = { x: front.width, y: front.height };
            this.graveyard = new Graveyard(this.frontCtx, { x: 0, y: 0 });
        }
        Game.prototype.searchQueue = function (id) {
            for (var _i = 0, _a = this.queue; _i < _a.length; _i++) {
                var champ = _a[_i];
                if (champ.getID() == id)
                    return champ;
            }
            return null;
        };
        Game.prototype.tick = function (timeDelta) {
            var _this = this;
            this.frontCtx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
            switch (this.state) {
                case 0:
                    if (this.timeout <= 0)
                        this.newChallenger();
                    else
                        this.timeout -= timeDelta;
                    break;
                case 2:
                    if (this.timeout <= 0)
                        this.clearDead();
                    else
                        this.timeout -= timeDelta;
                    break;
                case 1:
                    break;
                default:
                    console.error('bad game state');
            }
            this.arena.forEach(function (c) { return c.tick(timeDelta); });
            this.arena.forEach(function (c) { return c.draw(); });
            this.graveyard.draw();
            window.requestAnimationFrame(function (timestamp) {
                var delta = timestamp - _this.lastTimestamp;
                _this.lastTimestamp = timestamp;
                delta = delta * 4;
                _this.tick(delta);
            });
        };
        Game.prototype.newChallenger = function () {
            var champ = this.queue.shift();
            if (champ == undefined) {
                return;
            }
            this.arena.push(champ);
            this.timeout = Game.fightTimeout;
            this.updateArenaLocations();
            if (this.arena.length >= 2) {
                this.state = 1;
                this.arena.forEach(function (c) { return c.fight(); });
            }
            console.log("new challenger");
            console.log(this);
        };
        Game.prototype.updateArenaLocations = function () {
            if (this.arena[0]) {
                this.arena[0].setPosition(Game.championLocation);
                this.arena[0].setFacingDirection(false);
            }
            if (this.arena[1]) {
                this.arena[1].setPosition(Game.challengerLocation);
                this.arena[1].setFacingDirection(true);
            }
        };
        Game.prototype.clearDead = function () {
            var _this = this;
            if (this.arena[0] && this.arena[0].isDead())
                this.graveyard.clearqueue();
            this.arena = this.arena.filter(function (c) {
                if (c.isDead()) {
                    _this.graveyard.addloser(c);
                    return false;
                }
                return true;
            });
            this.arena.forEach(function (c) { return c.heal(); });
            this.updateArenaLocations();
            this.state = 0;
            this.timeout = Game.fightTimeout;
        };
        Game.prototype.donate = function (donation) {
            var _this = this;
            var champ;
            if (this.arena[0] && this.arena[0].getID() == donation.id)
                this.arena[0].donate(donation.amount);
            else if (this.arena[1] && this.arena[1].getID() == donation.id)
                this.arena[1].donate(donation.amount);
            else if ((champ = this.searchQueue(donation.id)) != null)
                champ.donate(donation.amount);
            else {
                var pick = ClassPicker.pickCharacter(donation);
                this.queue.push(new Combatant.Combatant(this.frontCtx, Game.challengerLocation, donation.id, donation.name, iconArt[Math.floor((iconArt.length * Math.random()))], pick.spriteUrl, pick.stats, function () {
                    _this.state = 2;
                    _this.arena.forEach(function (c) { return c.wait(); });
                }, function (combatant, damage, accuracy) {
                    if (_this.arena[0] && _this.arena[0] != combatant)
                        _this.arena[0].takeHit(damage, accuracy);
                    else if (_this.arena[1])
                        _this.arena[1].takeHit(damage, accuracy);
                }));
            }
        };
        Game.fightTimeout = 3000;
        Game.championLocation = { x: 20, y: 30 };
        Game.challengerLocation = { x: 100, y: 30 };
        return Game;
    }());
    Game_1.Game = Game;
    var Graveyard = (function (_super) {
        __extends(Graveyard, _super);
        function Graveyard() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.graveyardqueue = [];
            return _this;
        }
        Graveyard.prototype.addloser = function (champ) {
            this.graveyardqueue.push(champ);
        };
        Graveyard.prototype.newqueue = function (champ) {
            this.graveyardqueue = [];
            this.graveyardqueue.push(champ);
        };
        Graveyard.prototype.clearqueue = function () {
            this.graveyardqueue = [];
        };
        Graveyard.prototype.draw = function () {
            for (var i = 0; i < this.graveyardqueue.length; i++) {
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.webkitImageSmoothingEnabled = false;
                this.ctx.mozImageSmoothingEnabled = false;
                this.ctx.drawImage(this.graveyardqueue[i].getIcon(), 0, 0 + 20 * i);
            }
        };
        Graveyard.prototype.tick = function () { };
        return Graveyard;
    }(Actor));
})(Game || (Game = {}));
document.addEventListener("DOMContentLoaded", function () {
    var arenaFront = document.getElementById("arena-front");
    var arenaBack = document.getElementById("arena-front");
    if (arenaFront == null || arenaBack == null) {
        console.error("missing DOM hook");
        return;
    }
    var game = new Game.Game(arenaFront, arenaBack);
    game.tick(performance.now());
    window.addEventListener('storage', function (e) {
        console.log(e);
        switch (e.key) {
            case 'donation':
                var str = e.newValue;
                if (str == undefined) {
                    console.error('bad storage event value');
                    break;
                }
                game.donate(JSON.parse(str));
                break;
            default:
                console.error('unidentified storage event');
        }
    });
});
//# sourceMappingURL=index.js.map