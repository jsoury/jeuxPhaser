const Player = {
  player: null,
  cursors: null,
  vKey: null,
  bKey: null,
  

extremiterKuru1 : null, 
  initialiserPlayer: function () {
    this.player = jeu.scene.physics.add.sprite(
      jeu.world.positionStart.x,
      jeu.world.positionStart.y,
      "robertoAtlas",
      "character_malePerson_idle"
    );
    this.player.setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true, true, false, true, false);
  },

  animationPlayer: function () {
    jeu.scene.anims.create({
      key: "robertoMove",
      frames: jeu.scene.anims.generateFrameNames("robertoAtlas", {
        prefix: "character_malePerson_walk",
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
    jeu.scene.anims.create({
      key: "robertoIdle",
      frames: [
        { key: "robertoAtlas", frame: "character_malePerson_idle" },
        { key: "robertoAtlas", frame: "character_malePerson_behindBack" },
      ],
      frameRate: 2,
      repeat: -1,
    });
    // jeu.scene.anims.create({
    //   key: "robertoKick",
    //   frames: [{ key: "roberto", frame: 1 }],
    //   frameRate: 20,
    // });
    // jeu.scene.anims.create({
    //   key: "robertoPunch",
    //   frames: [{ key: "roberto", frame: 0 }],
    //   frameRate: 20,
    // });
  },
  genererComandeClavier: function () {
    //Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right, and also Space Bar and shift.

    this.cursors = jeu.scene.input.keyboard.createCursorKeys();
    this.bKey = jeu.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.vKey = jeu.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);

    //this.btnCommande();
  },
  genererCommandeBouton: function () {},

  gererDeplacement: function () {
    if (!jeu.gameOver && !jeu.win) {
      if (this.cursors.left.isDown) {
        this.player.setFlip(true, false);
        this.player.setVelocityX(-200);
        this.player.anims.play("robertoMove", true);
        if (this.cursors.shift.isDown) {
          this.player.setVelocityX(-300);
        }
      } else if (this.cursors.right.isDown) {
        this.player.setFlip(false, false);
        this.player.setVelocityX(200);
        this.player.anims.play("robertoMove", true);
        if (this.cursors.shift.isDown) {
          this.player.setVelocityX(300);
        }
      } else {
        this.player.anims.play("robertoIdle", true);
        this.player.setVelocityX(0);
      }
      if (this.cursors.space.isDown && this.player.body.onFloor()) {
        jeu.scene.sound.play("jump", { volume: 0.2 });
        this.player.setVelocityY(-375);
      } else if (!this.player.body.onFloor()) {
        this.player.setTexture("robertoAtlas", "character_malePerson_jump");
      }
    } else if (jeu.gameOver) {
      jeu.scene.physics.pause();
      this.player.setTexture("robertoAtlas", "character_malePerson_hit");
      this.player.setTint(0xff0000);
    } else {
      jeu.scene.physics.pause();
      this.player.setTexture("robertoAtlas", "character_malePerson_cheer0");
    }
  },
  killPlayer: function () {
    jeu.gameOver = true;
    jeu.world.AffichergameOver();
  },
};
