/*********************************************************************
***
*Original Author: Kevin Greene *
*Date Created: 3/30/2021 *
*Version: 1 *
*Date Last Modified: 4/2/2021 *
*Modified by: Kevin Greene *
*Modification log: *Created preloader to load maps
                   *Loaded Level 1 and tileset

          4/2/2021 *Loaded in level 2 from json in map
***
******************************************************************** */

import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.image("tiles", "src/map/tileset.png");
    this.load.tilemapTiledJSON("Level_1", "src/map/Level1.json");
    this.load.tilemapTiledJSON("Level_2", "src/map/Level2.json");
    this.load.tilemapTiledJSON("Level_3", "src/map/Level_3.json");
  }

  create() {
    this.scene.start("Level_1");
  }
}
