"use strict";
var Game;
(function (Game_1) {
    var spriteArt = [
        'images/animation/champion_alpha.png',
        'images/animation/Axe/Axe.png',
        'images/animation/Katana/Katana.png',
        'images/animation/Orc/Orc.png',
        'images/animation/Wizard/Wizard.png'
    ];
    var iconArt = [
        'images/icons/cherries.png',
        'images/icons/banana.png',
        'images/icons/lime-icon.png',
        'images/icons/orange-icon.png'
    ];
    var Game = (function () {
        function Game(front, back) {
            this.challenger = null;
            this.champion = null;
            this.queue = [];
            this.graveyard = [];
            var frontCtx = front.getContext('2d');
            var backCtx = front.getContext('2d');
            if (frontCtx == null || backCtx == null) {
                console.error("could not get get canvas 2d context");
                return;
            }
            this.frontCtx = frontCtx;
            this.backCtx = backCtx;
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
            if (this.champion)
                this.champion.tick(timeDelta);
            if (this.challenger)
                this.challenger.tick(timeDelta);
            window.requestAnimationFrame(function (timestamp) {
                var delta = timestamp - _this.lastTimestamp;
                _this.lastTimestamp = timestamp;
                _this.tick(delta);
            });
        };
        Game.prototype.newChallenger = function () {
            var champ = this.queue.shift();
            if (champ == undefined) {
                console.log("no champions in queue");
                return;
            }
            if (this.champion == null)
                this.champion = champ;
            else
                this.challenger = champ;
            console.log("new challenger");
            console.log(this);
        };
        Game.prototype.donate = function (donation) {
            var champ;
            if (this.champion != null && this.champion.getID() == donation.id) {
                this.champion.donate(donation.amount);
            }
            else if (this.challenger != null && this.challenger.getID() == donation.id)
                this.challenger.donate(donation.amount);
            else if ((champ = this.searchQueue(donation.id)) != null)
                champ.donate(donation.amount);
            else {
                this.queue.push(new Champion.Champion(this.frontCtx, { x: 0, y: 0 }, donation.id, donation.name, iconArt[Math.floor((iconArt.length * Math.random()))], spriteArt[(donation.art - 1) % 5], {
                    hp: 100,
                    power: donation.amount,
                    regeneration: 30
                }));
            }
        };
        return Game;
    }());
    Game_1.Game = Game;
})(Game || (Game = {}));
//# sourceMappingURL=Game.js.map