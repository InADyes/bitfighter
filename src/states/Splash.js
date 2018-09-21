import Phaser from "phaser";
import {
  centerGameObjects
} from "../utils";

export default class extends Phaser.State {
  init() {}

  preload() {
    //
    // load your assets
    //
    // this.load.image("health_good", "assets/images/health_good.jpg");
    this.load.image("health_bg", "assets/images/white_square.png");

    const characters = [
      "cyclop-1",
      "cyclop-2",
      "cyclop-3",
      "golem-1",
      "golem-2",
      "golem-3",
      "necromancer-1",
      "necromancer-2",
      "necromancer-3"
    ];

    characters.forEach(character => {
      this.game.load.atlasJSONHash(
        character,
        `./assets/sprites/${character}/data.png`,
        `./assets/sprites/${character}/data.json`
      );
    });


    const characters2d = [
      'Barkeep',
      'Dragon',
      'Grave Digger',
      'Mage',
      'Medium',
      'Minstrel',
      'Rogue',
      'Scullery Maid',
      'Swashbuckler',
      'Warlock',
      'Warpriest'
    ];

    characters2d.forEach(char => {
      this.load.image(char, `assets/images/champions/${char}.png`);
    })
  }

  create() {
    this.state.start("Game");
  }
}