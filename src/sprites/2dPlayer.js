import Phaser from 'phaser';
import {
  getPlayerAnimationFrames
} from '../utils';

// 317 328

export default class extends Phaser.Sprite {
  constructor({
    game,
    x,
    y,
    asset,
    position,
    player,
    stats
  }) {
    super(game, x, y, asset);
    this.originalY = y;
    this.originalX = x;
    this.game = game;
    this.playerInfo = player;

    this.playerName = null;
    this.buffList = [];
    if (stats) {
      baseStats = {
        health: stats.health,
        bonus: stats.bonus,
        accuracy: stats.accuracy,
        dodge: stats.dodge,
        armor: stats.armor,
        damage: stats.damage,
        speed: stats.speed,
        buff: stats.buff
      };
    }
    // Will be used for health bar as height is px based and need to get % from maxHealth/currentHealth;
    this.leftOrRight = position;
    this.healthBar = null;
    this.healthBarBase = null;
    this.hasBeenIdle = false;

    /* if (this.width < 300) {
      this.scale.setTo(1.65);
    } */
    this.scale.setTo(0.5);

    if (this.leftOrRight === 'right') {
      this.scale.x *= -1;
    }

    // Set anchor to center of sprite
    this.anchor.setTo(0.5);

    this.createHealthBar();

    game.add.existing(this);
    // Tween setup
    this.setupTweens();
    this.createNameText();
    this.goIdle();
  }

  setupTweens() {
    // Idle
    this.idleTween = this.game.add.tween(this).to({
        y: this.y + 5
      },
      500,
      'Linear',
      false,
      0,
      -1,
      true
    );

    // Attack
    const atkTweenData =
      this.leftOrRight === 'right' ? this.x - 25 : this.x + 25;
    this.attackTween = this.game.add.tween(this).to({
        x: atkTweenData
      },
      100
    );
    this.attackTween.onComplete.add(attackReverseTween, this);

    function attackReverseTween() {
      const reverseTween = this.game.add.tween(this).to({
          x: this.originalX
        },
        100,
        'Linear',
        true
      );
      reverseTween.onComplete.add(function () {
        this.goIdle();
      }, this);
    }

    // Die
    const dieTweenData = this.leftOrRight === 'right' ? -90 : 90;
    this.dieTween = this.game.add.tween(this).to({
        angle: dieTweenData
      },
      100,
      'Linear',
      false
    );
  }

  update() {}

  goAttack() {
    this.idleTween.pause();
    this.game.add.tween(this).to({
        x: this.originalX
      },
      0,
      'Linear',
      true
    );
    this.attackTween.start(0);
  }

  goIdle() {
    if (this.attackTween.isRunning) {
      this.attackTween.stop();
    }
    if (this.hasBeenIdle) {
      this.idleTween.resume();
    } else {
      this.idleTween.start();
    }
    this.hasBeenIdle = true;
  }

  goHurt(dmg) {
    this.playerInfo.currentHp -= dmg;
    if (this.playerInfo.currentHp < 1) {
      return this.goDie();
    }
    this.createTextHandler(`Hit ${dmg}`);
    const rawPerctLeft =
      this.playerInfo.currentHp / this.playerInfo.stats.max_hit_points;
    const perctLeft = Math.floor(rawPerctLeft * 100);
    if (perctLeft < 25) {
      this.healthBar.tint = 0xff0000;
    } else if (perctLeft < 50) {
      this.healthBar.tint = 0xff3300;
    } else if (perctLeft < 75) {
      this.healthBar.tint = 0xffff00;
    }
    const newHealthBarHeight = 250 * rawPerctLeft;
    this.healthBar.height = newHealthBarHeight > 0 ? newHealthBarHeight : 0;
  }

  goHeal(heal) {}

  goDie() {
    this.healthBar.height = 0;
    this.idleTween.pause();
    this.attackTween.stop();
    this.dieTween.start();
    setTimeout(() => {
      this.destroy();
      this.playerName.destroy();
      this.healthBar.destroy();
      this.healthBarBase.destroy();
    }, 3000);
  }

  goDodge() {
    this.createTextHandler('Dodge', 'right');
  }

  goBuff(name, apply) {
    this.createBuffTextHandler(name, apply);
  }
  goAddBuff(buff, apply) {
    this.buffList.push(buff);
    this.createBuffTextHandler(`Applied ${buff.meta.name}`, apply);
  }
  goRemoveBuff(buff, apply) {
    this.createBuffTextHandler(`Remove ${this.buffList[buff.meta.index].meta.name}`, apply);
    this.buffList = this.buffList.slice(buff.meta.index, 1);
  }

  createHealthBar() {
    const width = this.width < 1 ? this.width * -1 : this.wdith;
    const x = this.leftOrRight === 'right' ? this.game.width - 70 : 30;

    this.healthBarBase = this.game.add.image(
      x,
      this.y + this.height / 2,
      'health_bg'
    );
    this.healthBarBase.tint = 0xd2cdc7;
    this.healthBarBase.width = 40;
    this.healthBarBase.anchor.setTo(0, 1);
    this.healthBarBase.height = 250;
    this.healthBarBase.alpha = 0.3;
    this.healthBar = this.game.add.image(
      x,
      this.y + this.height / 2,
      'health_bg'
    );
    this.healthBar.tint = 0x00ff00;
    this.healthBar.width = 40;
    this.healthBar.anchor.setTo(0, 1);
    this.healthBar.height = 250;

    this.game.add.existing(this.healthBarBase);
    this.game.add.existing(this.healthBar);
  }

  createNameText() {
    this.playerName = this.game.add.text(
      0,
      this.y + this.height / 2,
      this.playerInfo.name, {
        font: '32px Luckiest Guy',
        fill: 'yellow',
        smoothed: false
      }
    );
    this.playerName.x = this.x - this.playerName.width / 2;
    this.game.add.existing(this.playerName);
  }

  createTextHandler(txt, side = 'left') {
    let banner = this.game.add.text(0, 100, txt, {
      font: `${side === 'left' ? '24' : '22'}px Luckiest Guy`,
      fill: `${side === 'left' ? 'red' : 'yellow'}`,
      smoothed: false
    });
    if (side === 'left') {
      banner.x = this.x - banner.width + 10;
    } else {
      banner.x = this.x + banner.width / 2;
    }
    this.game.add.existing(banner);
    this.game.add.tween(banner).to({
        y: -banner.height
      },
      1000,
      Phaser.Easing.Linear.None,
      true
    );
    setTimeout(() => {
      banner.destroy();
    }, 1500);
  }

  createBuffTextHandler(txt, apply) {
    let banner = this.game.add.text(0, this.y, txt, {
      font: `22px Luckiest Guy`,
      fill: `${apply ? 'green' : 'orange'}`,
      smoothed: false
    });
    banner.x = this.x - banner.width / 2;
    this.game.add.existing(banner);
    this.game.add.tween(banner).to({
        y: -banner.height
      },
      2000,
      Phaser.Easing.Linear.None,
      true
    );
    setTimeout(() => {
      banner.destroy();
    }, 2100);
  }
}