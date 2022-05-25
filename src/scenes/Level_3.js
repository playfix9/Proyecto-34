/*********************************************************************
***
*Original Author: Kevin Greene *
*Date Created: 3/30/2021 *
*Version: 1 *
*Date Last Modified: 4/2/2021 *
*Modified by: Kevin Greene *
*Modification log: *Created Level 3 and pasted Level 2
                   *Changed maps for Level 3
                   *Added additional enemy to Level 3


***
******************************************************************** */

import Phaser from "phaser";

/***********************
    Variables to change
**********************/
var map;
var tileset;
var ground;
var obstacles;
var player;
var cursors;
var playerAttack;
var attackHit;
var danger;
var gameOver = false;
var playerRun;
var lvlText;
var enemy1;
var enemy2;
var distance;
var door = 0;

/************
    LEVEL 1
************/
export default class Level_3 extends Phaser.Scene {
  constructor() {
    super("Level_3");
  }

  preload() {
    this.load.spritesheet("player", "src/player/playersheet.png", {
      frameWidth: 50,
      frameHeight: 37
    });
    this.load.spritesheet("playerRunRight", "src/player/runRight.png", {
      frameWidth: 50,
      frameHeight: 37
    });
    this.load.spritesheet("playerRunLeft", "src/player/run-left.png", {
      frameWidth: 50,
      frameHeight: 37
    });
    this.load.spritesheet("enemyRight", "src/enemy/enemyRight.png", {
      frameWidth: 22,
      frameHeight: 33
    });
    this.load.spritesheet("enemyLeft", "src/enemy/enemyLeft.png", {
      frameWidth: 22,
      frameHeight: 33
    });
    this.load.spritesheet("attackLeft", "src/enemy/attackLeft.png", {
      frameWidth: 42,
      frameHeight: 35,
      spacing: 1
    });
    this.load.spritesheet("attackRight", "src/enemy/Skeleton Attack.png", {
      frameWidth: 43,
      frameHeight: 35
    });
  }
  create() {
    /************
        MAP
    ************/
    map = this.make.tilemap({ key: "Level_3" });
    tileset = map.addTilesetImage("tileset", "tiles");
    ground = map.createLayer("Ground", tileset);

    map.createLayer("Background", tileset);
    obstacles = map.createLayer("Blocked", tileset);
    danger = map.createLayer("Danger", tileset);

    obstacles.setCollisionBetween(1, 500, true);
    danger.setCollisionBetween(1, 1000, true);
    ground.setCollisionBetween(1, 1000, true);

    /************
        PLAYER
    ************/
    player = this.physics.add.sprite(3, 5, "player");
    player.setScale(0.7);
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
    playerAttack = this.input.keyboard.addKey(32);
    /*****************
        PLAYER ANIMS
    *****************/
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("playerRunRight", {
        start: 0,
        end: 5
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("playerRunLeft", {
        start: 0,
        end: 5
      }),
      frameRate: 10,
      repeat: -1,
      flipX: true
    });

    this.anims.create({
      key: "turn", //turn animation on sprite sheet
      frames: [{ key: "player", frame: 0 }],
      frameRate: 10
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", { start: 15, end: 23 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("player", { start: 45, end: 52 }),
      frameRate: 20,
      repeat: -1
    });

    /************
      ENEMY
    ************/
    enemy1 = this.physics.add.sprite(600, 100, "enemy");
    enemy1.setScale(0.6);
    enemy1.setCollideWorldBounds(true);

    enemy2 = this.physics.add.sprite(300, 5, "enemyRight");
    enemy2.setScale(0.6);
    enemy2.setCollideWorldBounds(true);

    /************
      ENEMY ANIMS
    ************/
    this.anims.create({
      key: "enemyRight",
      frames: this.anims.generateFrameNumbers("enemyRight", {
        start: 0,
        end: 12
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "enemyLeft",
      frames: this.anims.generateFrameNumbers("enemyLeft", {
        start: 0,
        end: 12
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "attackLeft",
      frames: this.anims.generateFrameNumbers("attackLeft", {
        start: 17,
        end: 0
      }),
      frameRate: 20,
      repeat: 0
    });
    this.anims.create({
      key: "attackRight",
      frames: this.anims.generateFrameNumbers("attackRight", {
        start: 0,
        end: 17
      }),
      frameRate: 20,
      repeat: 0
    });
    enemy1.setVelocityX(20);
    enemy1.setImmovable();
    enemy2.setImmovable();

    /************
      PHYSICS
    ************/
    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, obstacles);
    this.physics.add.collider(player, danger, hitBomb);
    this.physics.add.collider(enemy1, ground);
    this.physics.add.collider(enemy1, obstacles);
    this.physics.add.collider(player, enemy1, attackEnemy);
    this.physics.add.collider(enemy2, ground);
    this.physics.add.collider(enemy2, obstacles);
    this.physics.add.collider(player, enemy2, attackEnemy);
  }
  update() {
    distance = Phaser.Math.Distance.BetweenPoints(player, enemy1);
    /************
    PLAYER MOVEMENT
    ************/
    if (cursors.left.isDown && !cursors.up.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (cursors.right.isDown && !cursors.up.isDown) {
      player.setVelocityX(160);
      player.anims.play("right", true);
    } else if (playerAttack.isDown) {
      player.anims.play("attack", true);
      player.setVelocityX(0);
      player.setVelocityY(0);
      attackEnemy(player, enemy1, distance);
    } else {
      player.setVelocityX(0);
      player.anims.play("turn", true);
    }
    if (
      cursors.up.isDown &&
      !cursors.right.isDown &&
      !cursors.left.isDown &&
      player.body.velocity.y === 0
    ) {
      player.setVelocityY(-200);
      player.anims.play("jump", true);
    }

    if (door === 1 && cursors.right.isDown) {
      this.scene.start("Level_3");
    }

    if (gameOver === true) {
      this.physics.pause();
      lvlText = this.add.text(100, 16, "Game Over", {
        fontSize: "50px",
        fill: "#FF4633"
      });
      player.anims.play("death", true);
    }
    /**************** 
ENEMY MOVEMENT
*****************/
    if (enemy1.body.velocity.x === 20) {
      enemy1.anims.play("enemyRight", true);
    } else if (enemy1.body.velocity.x === -20) {
      enemy1.anims.play("enemyLeft", true);
    }

    if (enemy1.body.velocity.x < 20 && enemy1.body.velocity.x !== -20) {
      enemy1.body.velocity.x = 20;
      enemy1.body.bounce.x = 1;
    } else if (enemy1.body.velocity.x > -20 && enemy1.body.velocity.x !== 20) {
      enemy1.body.velocity.x = -20;
      enemy1.body.bounce.x = 1;
    }
    if (distance < 27 && enemy1.body.enable) {
      enemyAttack(player, enemy1, distance);
    }
  }
}
function hitBomb(player, danger) {
  player.setTint(0xff0000);
  player.anims.play("turn");
  gameOver = true;
}

function attackEnemy(player, enemy) {
  if (playerAttack.isDown) {
    enemy.disableBody(true, true);
  }
}
function enemyAttack(player, enemy, distance) {
  enemy.setVelocityX(0);
  if (distance < 0) {
    enemy.anims.play("attackRight", true);
  } else if (distance > 0) {
    enemy.anims.play("attackLeft", true);
  }
  player.anims.play("death", true);
  player.setTint(0xff0000);
  gameOver = true;
}
function goingUp(player) {
  player.body.setVelocityY(20);
}
