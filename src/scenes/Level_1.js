/*********************************************************************
***
*Original Author: Kevin Greene *
*Date Created: 3/30/2021 *
*Version: 1 *
*Date Last Modified: 4/2/2021 *
*Modified by: Kevin Greene *
*Modification log: *Created Level 1 with map from Tiled
                   *Created Player from sprite sheet
                   *Added physics between map and Player
                   *Added movement to player

          4/1/2021 *Created enemy and added physics between enemy and map
                   *Created enemy movement
                   *Improved player frames and added enemy frames

          4/2/2021 *Created attack for player to kill enemy
                   *Createdhttps://xqszg.csb.app/ a way to move to next level and created next level
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
var enemy;
var door = 0;
var distance;
/************
    LEVEL 1
************/
export default class Level_1 extends Phaser.Scene {
  constructor() {
    super("Level_1");
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
    map = this.make.tilemap({ key: "Level_1" });
    tileset = map.addTilesetImage("tileset", "tiles");
    ground = map.createLayer("Ground", tileset);

    map.createLayer("Background", tileset);
    obstacles = map.createLayer("Blocked", tileset);
    danger = map.createLayer("Danger", tileset);

    obstacles.setCollisionBetween(1, 1000, true);
    danger.setCollisionBetween(1, 1000, true);
    ground.setCollisionBetween(1, 1000, true);

    /************
        PLAYER
    ************/
    player = this.physics.add.sprite(7, 100, "player");
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
      repeat: -1,
      frameTotal: 9
    });

    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("player", { start: 45, end: 52 }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "death",
      frames: this.anims.generateFrameNumbers("player", { start: 66, end: 68 }),
      frameRate: 1,
      repeat: -1
    });

    /************
      ENEMY
    ************/
    enemy = this.physics.add.sprite(300, 100, "enemy");
    enemy.setScale(0.8);
    enemy.setCollideWorldBounds(true);

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

    enemy.setVelocityX(20);
    enemy.setImmovable();

    /************
      PHYSICS
    ************/
    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, obstacles);
    this.physics.add.collider(player, danger, hitBomb);
    this.physics.add.collider(enemy, ground);
    this.physics.add.collider(enemy, obstacles);
    this.physics.add.collider(player, enemy);
  }
  update() {
    distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
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
      attackEnemy(player, enemy, distance);
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
      this.scene.start("Level_2");
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
    if (enemy.body.velocity.x === 20) {
      enemy.anims.play("enemyRight", true);
    } else if (enemy.body.velocity.x === -20) {
      enemy.anims.play("enemyLeft", true);
    }

    if (enemy.body.velocity.x < 20 && enemy.body.velocity.x !== -20) {
      enemy.body.velocity.x = 20;
      enemy.body.bounce.x = 1;
    } else if (enemy.body.velocity.x > -20 && enemy.body.velocity.x !== 20) {
      enemy.body.velocity.x = -20;
      enemy.body.bounce.x = 1;
    }
    if (distance < 27 && enemy.body.enable) {
      enemyAttack(player, enemy, distance);
    }
    if (player.body.position.x === 445) {
      door = 1;
    }
  }
}
function hitBomb(player, danger) {
  player.setTint(0xff0000);
  player.anims.play("turn");
  gameOver = true;
}

function attackEnemy(player, enemy, distance) {
  if (playerAttack.isDown && distance < 40) {
    enemy.disableBody(true, true);
    distance = null;
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
