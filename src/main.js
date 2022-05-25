/*********************************************************************
***
*Original Author: Kevin Greene *
*Date Created: 3/30/2021 *
*Version: 1 *
*Date Last Modified: 4/2/2021 *
*Modified by: Kevin Greene *
*Modification log: *Created Project with Phaser template
                   *Created Preloader and Level 1

          4/2/2021 *Added Level 2 to scenes
***
******************************************************************** */

import Phaser from "phaser";
import Preloader from "./scenes/Preloader";
import Level_1 from "./scenes/Level_1.js";
import Level_2 from "./scenes/Level_2.js";
import Level_3 from "./scenes/Level_3.js";

const config = {
  width: 480,
  height: 210,
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: [Preloader, Level_1, Level_2, Level_3],
  scale: {
    zoom: 3
  }
};

const game = new Phaser.Game(config);

export default game;
