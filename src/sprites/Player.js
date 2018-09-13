import Phaser from 'phaser';
import { getPlayerAnimationFrames } from '../utils';

// 317 328

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset, position, player, stats }) {
    super(game, x, y, asset);
    this.originalY = y;
    this.game = game;
    if (player) {
      basePlayer = {
        name: player.name || null,
        level: player.level
      };
    }

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
    this.maxHealth;
    this.leftOrRight = position;
    this.health = null;

    this.hasCrit = false;

    if (this.width < 300) {
      this.scale.setTo(1.65);
    }

    console.log(this.leftOrRight, this.width, this.height);

    if (this.leftOrRight === 'right') {
      this.scale.x *= -1;
    }

    // Set anchor to center of sprite
    this.anchor.setTo(0, 1);

    this.createAnimations();
    this.createHealthBar();

    game.add.existing(this);
  }

  update() {
    this.y = this.originalY;
  }

  goAttack() {
    /* if (this.hasCrit) {
      if (Math.floor(Math.random() * 100) > 75) {
        this.animations.play("attack-2", 15, false);
      } else {
        this.animations.play("attack", 15, false);
      }
    } else {
      this.animations.play("attack", 15, false);
    } */
    this.animations.play('attack', 15, false);
  }

  goIdle() {
    this.animations.play('idle', 15, true);
  }

  goHurt(dmg) {
    this.animations.play('hurt', 30, false);
    this.createTextHandler('Hit');
    /* this.health.height =
      this.height - this.height * ((this.health - dmg) / this.maxHealth); */
  }

  goHeal(heal) {
    this.health.height = (this.height * (this.health + heal)) / this.maxHealth;
    this.createTextHandler('Healed');
  }

  goDie() {
    this.animations.play('die', 30, false);
  }

  goDodge() {
    this.createTextHandler('Dodge');
  }

  createHealthBar() {
    this.health = this.game.add.image(
      this.leftOrRight === 'right' ? this.x + 10 : 30,
      this.y,
      'health_good'
    );
    this.health.width = 40;
    this.health.anchor.setTo(0, 1);
    this.health.height = 250;

    this.game.add.existing(this.health);
  }

  createAnimations() {
    // Get frame setup from JSON.
    const frames = getPlayerAnimationFrames(this.animations);
    // Add animations
    const attackAnim = this.animations.add('attack', frames.attack);
    const hitAnim = this.animations.add('hit', frames.hit);
    this.animations.add('idle', frames.idle);
    this.animations.add('die', frames.die);
    const critAnim = this.animations.add('attack-2', frames['attack-2']);
    if (frames['attack-2'].length > 0) {
      this.hasCrit = true;
    }
    attackAnim.onComplete.add(goIdle, this);
    critAnim.onComplete.add(goIdle, this);
    // attackAnim.onStart.add(attackStart, this);
    hitAnim.onComplete.add(goIdle, this);
    this.goIdle();

    function goIdle() {
      this.goIdle();
    }
  }

  createTextHandler(txt) {
    const x =
      this.leftOrRight === 'left' ? this.x + 50 : this.x + this.width / 2 - 50;
    let banner = this.game.add.text(x, this.y / 2, txt, {
      font: '40px Luckiest Guy',
      fill: '#77BFA3',
      smoothed: false
    });
    this.game.add.existing(banner);
    this.game.add.tween(banner).to(
      {
        y: -5
      },
      2000,
      Phaser.Easing.Linear.None,
      true
    );
    setTimeout(() => {
      banner.destroy();
    }, 1500);
  }
}
