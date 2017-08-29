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
var Champion;
(function (Champion_1) {
    var Champion = (function (_super) {
        __extends(Champion, _super);
        function Champion(ctx, pos, id, name, icon, sprite, stats) {
            var _this = _super.call(this, ctx, pos) || this;
            _this.id = id;
            _this.name = name;
            _this.icon = icon;
            _this.sprite = sprite;
            _this.stats = stats;
            _this.healthBar = new HealthBar(ctx, { x: 0, y: 0 });
            return _this;
        }
        Champion.prototype.toString = function () {
            return this.name;
        };
        Champion.prototype.setOpponent = function (opponent) {
            this.opponent = opponent;
        };
        Champion.prototype.tick = function (timeDelta) {
            this.draw();
            this.healthBar.tick(timeDelta);
        };
        Champion.prototype.draw = function () {
        };
        Champion.prototype.donate = function (amount) {
        };
        Champion.prototype.getID = function () {
            return this.id;
        };
        Champion.prototype.setPosition = function (pos) {
            this.pos = pos;
        };
        return Champion;
    }(Actor));
    Champion_1.Champion = Champion;
    var HealthBar = (function (_super) {
        __extends(HealthBar, _super);
        function HealthBar(ctx, pos) {
            var _this = _super.call(this, ctx, pos) || this;
            _this.targetHealth = 1000;
            _this.displayedYellow = 1000;
            return _this;
        }
        HealthBar.prototype.draw = function () {
        };
        HealthBar.prototype.tick = function (timeDelta) {
            this.draw();
        };
        HealthBar.prototype.setHealth = function (health) {
            this.targetHealth = health;
        };
        return HealthBar;
    }(Actor));
})(Champion || (Champion = {}));
//# sourceMappingURL=Champion.js.map