const World = {
  tilemap: null,
  tileset: null,
  overlapLayer: null,
  topLayer: null,
  worldLayer: null,
  botLayer: null,
  positionStart: null,
  positionEnd: null,
  score: 0,
  scoreText: null,
  key: false,
  configText: null,
  winText: null,

  initWorld: function () {
    this.configText = {
      image: "kingOldSchool",
      width: 31,
      height: 24,
      chars: Phaser.GameObjects.RetroFont.TEXT_SET2,
      charsPerRow: 10,
      spacing: { x: 0.5, y: 0.5 },
    };
    jeu.scene.cache.bitmapFont.add(
      "kingOldSchool",
      Phaser.GameObjects.RetroFont.Parse(this, this.configText)
    );

    jeu.scene.sound.play("ready", { volume: 0.2 });

    this.tilemap = jeu.scene.make.tilemap({ key: "mapJSON" });
    this.tileset = this.tilemap.addTilesetImage("platformPack_tilesheet", "mapTiles");
    this.overlapLayer = this.tilemap.createDynamicLayer("overlap", this.tileset, 0, 0);
    this.topLayer = this.tilemap.createStaticLayer("top", this.tileset, 0, 0);
    this.worldLayer = this.tilemap.createStaticLayer("world", this.tileset, 0, 0);
    this.botLayer = this.tilemap.createStaticLayer("bot", this.tileset, 0, 0);

    this.worldLayer.setCollisionByProperty({ Collides: true });

    jeu.scene.physics.world.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixel);
    this.overlapLayer.setTileIndexCallback(50, this.collectGemme, this);
    this.overlapLayer.setTileIndexCallback(52, this.collectGemme, this);
    this.overlapLayer.setTileIndexCallback(53, this.collectGemme, this);

    this.overlapLayer.setTileIndexCallback(63, this.collectKey, this);
    this.overlapLayer.setTileIndexCallback(64, this.collectKey, this);
    this.overlapLayer.setTileIndexCallback(65, this.collectKey, this);
    this.overlapLayer.setTileIndexCallback(66, this.collectKey, this);
    this.overlapLayer.setTileIndexCallback(67, this.collectKey, this);

    this.overlapLayer.setTileIndexCallback(71, this.collidePique, this);
    this.overlapLayer.setTileIndexCallback(79, this.finLevel, this);
    this.overlapLayer.setTileIndexCallback(93, this.finLevel, this);

    this.positionStart = this.tilemap.findObject("Objects", (obj) => obj.name === "start");
    this.positionEnd = this.tilemap.findObject("Objects", (obj) => obj.name === "end");
    this.rotateGemme();
    this.afficherScore();
  },
  rotateGemme() {
    var gemmes = jeu.scene.physics.add.group();

    gemmes.enableBody = true;
    var spriteConfig = {
      rotation: 10,
      angle: 25,
    };
    var sprites = this.tilemap.createFromTiles("platformPack_tilesheet", 50, spriteConfig);
    gemmes.create(sprites);
  },
  gererCollider: function () {
    jeu.scene.physics.add.collider(jeu.player.player, this.worldLayer);
    jeu.scene.physics.add.overlap(jeu.player.player, this.overlapLayer);
    jeu.scene.physics.add.collider(jeu.robot.robot, this.worldLayer);
    jeu.scene.physics.add.collider(jeu.player.player, jeu.robot.robot, this.collideRobot);
  },

  gererCamera: function () {
    jeu.scene.cameras.main.startFollow(jeu.player.player);
    jeu.scene.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixel);
  },

  collectGemme: function (player, tile) {
    jeu.scene.sound.play("getGemme", { volume: 0.5, rate: 0.2 });
    this.genererParticules(tile.getCenterX(), tile.getCenterY());
    this.getItemProperties(tile.properties.item);
    this.overlapLayer.removeTileAt(tile.x, tile.y).destroy();
  },
  collectKey: function (player, tile) {
    jeu.scene.sound.play("getKey", { volume: 0.5 });
    this.genererParticules(tile.getCenterX(), tile.getCenterY());
    this.getItemProperties(tile.properties.item);
    this.overlapLayer.removeTileAt(tile.x, tile.y).destroy();
  },
  genererParticules: function (posX, posY) {
    var emitterWhite = jeu.scene.add.particles("sparkWhite").createEmitter({
      x: posX,
      y: posY,
      speed: { min: -200, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: "SCREEN",
      //active: false,
      lifespan: 800,
      gravityY: -400,
    });
    var emitterRed = jeu.scene.add.particles("sparkRed").createEmitter({
      x: posX,
      y: posY,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      blendMode: "SCREEN",
      //active: false,
      lifespan: 300,
      gravityY: -400,
    });
    //emitter.setPosition(posX, posY);
    emitterWhite.explode();
    emitterRed.explode();
  },
  getItemProperties: function (item) {
    switch (item) {
      case "gemmeVert":
        this.score += 1;
        break;
      case "gemmeBleu":
        this.score += 5;
        break;
      case "gemmeOrange":
        this.score += 10;
        break;
      case "gemmeRouge":
        this.score += 15;
        break;
      case "key":
        this.key = true;
        break;
      default:
        "";
        break;
    }
    this.scoreText.setText("SCORE:" + this.score);
  },
  collidePique: function () {
    jeu.player.killPlayer();
  },

  touchFace: function (faces) {
    if (faces.left) {
      return "left";
    }

    if (faces.up) {
      return "up";
    }

    if (faces.right) {
      return "right";
    }

    if (faces.down) {
      return "down";
    }
  },
  collideRobot: function () {
    if (jeu.world.touchFace(jeu.robot.robot.body.touching) === "up") {
      jeu.robot.killRobot();
    } else jeu.player.killPlayer();
  },
  AffichergameOver: function () {
    if (jeu.gameOver) {
      jeu.scene.sound.play("loose", { volume: 0.4 });
      var imgGameOver = jeu.scene.add
        .image(jeu.scene.cameras.main.midPoint.x, jeu.scene.cameras.main.midPoint.y, "gameOver")
        .setInteractive();
      imgGameOver.setScale(0.1);
      jeu.scene.tweens.add({
        targets: imgGameOver,
        //ease: "Linear",
        scaleX: 1,
        scaleY: 1,
        duration: 1000,
      });
      jeu.scene.add.text(
        jeu.scene.cameras.main.midPoint.x,
        jeu.scene.cameras.main.midPoint.y + 100,
        "Click to restart",
        {
          font: "16px Courier",
          fill: "#00ff00",
        }
      );
      imgGameOver.on("pointerdown", function () {
        jeu.scene.scene.restart();
      });
    }
  },
  afficherScore: function () {
    this.scoreText = jeu.scene.add
      .bitmapText(20, 20, "kingOldSchool", "SCORE:0")
      .setTintFill(0xff0000, 0x0000ff, 0xff0000, 0x0000ff);
    this.scoreText.setScrollFactor(0);
  },
  finLevel: function (player) {
    if (this.key === true) {
      if (player.x >= this.positionEnd.x + 2) {
        jeu.win = true;
        jeu.scene.sound.play("win", { volume: 0.5 });
        this.winText = jeu.scene.add
          .bitmapText(
            jeu.scene.cameras.main.midPoint.x - 50,
            jeu.scene.cameras.main.midPoint.y - 200,
            "kingOldSchool",
            "YOU WIN"
          )
          .setTintFill(0x00ff00, 0x00cc00, 0x00a300, 0x008200, 0x006800, 0x005300)
          .setInteractive();
        jeu.scene.add.text(
          jeu.scene.cameras.main.midPoint.x - 50,
          jeu.scene.cameras.main.midPoint.y - 100,
          "Click to restart",
          {
            font: "16px Courier",
            fill: "#00ff00",
          }
        );
        this.winText.on("pointerdown", function () {
          jeu.scene.scene.restart();
        });
      }
    }
  },
};
