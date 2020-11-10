const Robot = {
  robot: null,
  robot1Start: null,
  initialiserRobot: function () {
    this.robot1Start = jeu.world.tilemap.findObject("Objects", (obj) => obj.name === "robot1Start");
    this.robot = jeu.scene.physics.add.sprite(
      this.robot1Start.x,
      this.robot1Start.y,
      "robotAtlas",
      "character_robot_idle"
    );
    this.robot.setOrigin(0.5, 1);
    this.robot.setCollideWorldBounds(true);
  },
  killRobot: function () {
    jeu.scene.sound.play("robotDead", { volume: 0.2 });
    this.robot.destroy();
    jeu.player.player.setBounce(0);
  },
  animationRobot: function () {
    jeu.scene.anims.create({
      key: "robotMove",
      frames: jeu.scene.anims.generateFrameNames("robotAtlas", {
        prefix: "character_robot_walk",
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
  },
  moveRobot: function () {
    this.robot.anims.play("robotMove");
    var teenRobot = jeu.scene.tweens.add({
      targets: this.robot,
      x: 900,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      repeat: -1,
      onStart: function () {},
      onComplete: function () {},
      onYoyo: function () {
        jeu.robot.robot.flipX = !jeu.robot.robot.flipX;
      },
      onRepeat: function () {
        jeu.robot.robot.flipX = !jeu.robot.robot.flipX;
      },
    });
  },
};
