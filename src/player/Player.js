import Phaser from "phaser";
var cursors;
var playerAttack;
var x;
var y;
export default class Player extends Phaser.GameObjects {
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
  }
  create() {
    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.sprite(x, y, "player");

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
      key: "death",
      frames: this.anims.generateFrameNumbers("player", { start: 66, end: 68 }),
      frameRate: 1,
      repeat: -1
    });
  }
  update() {
    if (cursors.left.isDown && !cursors.up.isDown) {
      this.setVelocityX(-160);

      this.anims.play("left", true);
    } else if (cursors.right.isDown && !cursors.up.isDown) {
      this.setVelocityX(160);
      this.anims.play("right", true);
    } else {
      this.setVelocityX(0);
      this.anims.play("turn", true);
    }
    if (
      cursors.up.isDown &&
      !cursors.right.isDown &&
      !cursors.left.isDown &&
      this.body.velocity.y === 0
    ) {
      this.setVelocityY(-200);
      this.anims.play("jump", true);
    }
  }
}
