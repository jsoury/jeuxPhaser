var world = {
  map: null,
  tileSheetTerrain: null,
  tileSheetObjet: null,
  overlapLayer: null,
  topLayer: null,
  worldLayerObjects: null,
  worldLayerTerrain: null,
  botLayer: null,
  positionStart: null,
  positionEnd: null,
  score: 0,
  scoreText: null,
  chronoText: null,
  recordText: null,
  nomRecordText: null,

  configText: {
    image: "kingOldSchool",
    width: 31,
    height: 24,
    chars: Phaser.GameObjects.RetroFont.TEXT_SET2,
    charsPerRow: 10,
    spacing: { x: 0.5, y: 0.5 },
  },

  initialiserWorld: function () {
    jeu.scene.cache.bitmapFont.add("kingOldSchool", Phaser.GameObjects.RetroFont.Parse(this, this.configText));

    this.map = jeu.scene.make.tilemap({ key: "map" + jeu.level });
    this.tileSheetTerrain = this.map.addTilesetImage("terrain", "tileSheetTerrain");
    this.tileSheetObjet = this.map.addTilesetImage("tile-sheet-objet", "tileSheetObjet");
    this.tileSheetPerso = this.map.addTilesetImage("tilesPerso", "tileSheetPerso");

    this.downLayer = this.map.createStaticLayer("bot", this.tileSheetTerrain, 0, 0);

    this.worldLayerTerrain = this.map.createStaticLayer("worldTerrain", this.tileSheetTerrain, 0, 0);
    this.worldLayerObjects = this.map.createDynamicLayer("worldObjects", this.tileSheetObjet, 0, 0);
    this.topLayer = this.map.createStaticLayer("top", this.tileSheetObjet, 0, 0);
    this.overlapLayer = this.map.createDynamicLayer("overlap", this.tileSheetPerso, 0, 0);

    this.positionStart = this.map.findObject("Objects", (obj) => obj.name === "start");
    this.positionEnd = this.map.findObject("Objects", (obj) => obj.name === "end");
    this.worldLayerObjects.setCollisionByProperty({ collides: true });
    this.worldLayerTerrain.setCollisionByProperty({ collides: true });

    jeu.scene.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.afficherPanelChrono();
  },
  gererCollider: function () {
    for (var propertie in this.positionStart.properties) {
      if (this.positionStart.properties[propertie].name === "nbPieces") {
        this.genererPiece(this.positionStart.properties[propertie].value);
      } else if (this.positionStart.properties[propertie].name === "nbBumper") {
        this.genererBumper(this.positionStart.properties[propertie].value);
      }
    }

    this.worldLayerObjects.setTileIndexCallback(this.getFirstgid("tile-sheet-objet") + 8, this.afficherfinLevel, this);

    for (var i = 0; i <= 26; i++) {
      if (i !== 8) {
        this.worldLayerObjects.setTileIndexCallback(this.getFirstgid("tile-sheet-objet") + i, this.collideKuru, this);
      }
    }

    for (var i = 0; i <= 39; i++) {
      this.worldLayerTerrain.setTileIndexCallback(this.getFirstgid("terrain") + i, this.collideKuru, this);
    }

    for (var i = 0; i <= 39; i++) {
      this.overlapLayer.setTileIndexCallback(this.getFirstgid("tilesPerso") + i, this.collideKuru, this);
    }

    jeu.scene.physics.add.overlap(jeu.player.extremiteKuru1, this.worldLayerTerrain);
    jeu.scene.physics.add.overlap(jeu.player.extremiteKuru2, this.worldLayerTerrain);

    jeu.scene.physics.add.collider(jeu.player.kuruCenter, this.worldLayerObjects);
    jeu.scene.physics.add.overlap(jeu.player.extremiteKuru1, this.worldLayerObjects);
    jeu.scene.physics.add.overlap(jeu.player.extremiteKuru2, this.worldLayerObjects);

    jeu.scene.physics.add.overlap(jeu.player.extremiteKuru1, this.overlapLayer);
    jeu.scene.physics.add.overlap(jeu.player.extremiteKuru2, this.overlapLayer);
  },
  gererCamera: function () {
    jeu.scene.cameras.main.startFollow(jeu.player.kuruCenter);
    jeu.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixel);
    this.getFirstgid("tile-sheet-objet");
  },
  getFirstgid: function (tilesheetName) {
    return this.map.getTileset(tilesheetName).firstgid;
  },
  collideKuru: function () {
    jeu.scene.sound.play("soundRestart", { volume: 0.5, rate: 2 });
    jeu.player.forceRotation = 1;
    jeu.scene.scene.restart();
  },
  genererPiece: function (nbPieces) {
    for (var i = 1; i <= nbPieces; i++) {
      var objectPiece = this.map.findObject("Objects", (obj) => obj.name === "piece" + i);
      var piece = jeu.scene.physics.add.sprite(objectPiece.x, objectPiece.y, "piece1").play("animePiece");
      jeu.scene.physics.add.overlap(jeu.player.kuruCenter, piece, this.collectPiece);
    }
  },
  animerPiece: function () {
    jeu.scene.anims.create({
      key: "animePiece",
      frames: [{ key: "piece1" }, { key: "piece2" }],
      frameRate: 2,
      repeat: -1,
    });
  },
  collectPiece: function (player, piece) {
    jeu.scene.sound.play("soundPiece", { volume: 3 });
    piece.destroy();
  },
  genererBumper: function (nbBumper) {
    for (var i = 1; i <= nbBumper; i++) {
      var objectBumper = this.map.findObject("Objects", (obj) => obj.name === "bumper" + i);
      var bumper = jeu.scene.physics.add.sprite(objectBumper.x, objectBumper.y, "tileSheetBumper").play("animeBumper");
      //jeu.scene.physics.add.collider(jeu.player.kuruBarre, bumper, this.collideBumper);
      jeu.scene.physics.add.collider(jeu.player.extremiteKuru1, bumper, this.collideBumper);
      jeu.scene.physics.add.collider(jeu.player.extremiteKuru2, bumper, this.collideBumper);
    }
  },
  animerBumper: function () {
    jeu.scene.anims.create({
      key: "animeBumper",
      frames: jeu.scene.anims.generateFrameNumbers("tileSheetBumper", { start: 0, end: 2 }),
      frameRate: 5,
    });
  },
  collideBumper: function (player, bumper) {
    if (jeu.player.forceRotation === 1) {
      jeu.player.forceRotation = -1;
    } else {
      jeu.player.forceRotation = 1;
    }
    bumper.play("animeBumper");
  },

  creerChrono: function () {
    jeu.timer = jeu.scene.time.addEvent({
      delay: 1000,
      callback: this.compteUneSeconde,
      callbackScope: jeu.scene,
      loop: true,
    });
  },
  compteUneSeconde: function () {
    jeu.seconde += 1;
    if (jeu.seconde > 59) {
      jeu.minute += 1;
      jeu.seconde = 0;
    }
  },
  getMilisecond: function () {
    return (jeu.mil = jeu.timer.getElapsedSeconds().toString().substr(2, 2));
  },
  updateChrono: function () {
    if (jeu.minute < 10) {
      jeu.stringMin = "0" + jeu.minute;
    } else jeu.stringMin = jeu.minute;

    if (jeu.seconde < 10) {
      jeu.stringSeconde = "0" + jeu.seconde;
    } else jeu.stringSeconde = jeu.seconde;

    jeu.world.chronoText.setText(jeu.stringMin + ":" + jeu.stringSeconde + ":" + jeu.mil);
  },
  gestionChrono() {
    if (
      jeu.player.kuruCenter.x === jeu.world.positionStart.x &&
      jeu.player.kuruCenter.y === jeu.world.positionStart.y
    ) {
      jeu.timer.paused = true;
      jeu.world.chronoText.setText(jeu.stringMin + ":" + jeu.stringSeconde + ":" + "00");
    } else {
      jeu.timer.paused = false;
    }
    if (jeu.win) {
      jeu.timer.paused = true;
      jeu.chrono = jeu.stringMin + ":" + jeu.stringSeconde + ":" + jeu.mil;
    }
  },
  afficherPanelChrono: function () {
    var configChrono = {
      fontSize: "33px",
      color: "#0068ff",
      fontFamily: "VT323, monospace",
    };
    var configRecord = {
      fontSize: "25px",
      fontWeight: "800",
      color: "#b0a51d",
      fontFamily: "VT323, monospace",
    };
    var configNameRecord = {
      fontSize: "20px",
      fontWeight: "800",
      color: "#b0a51d",
      fontFamily: "VT323, monospace",
    };
    jeu.record = gestionChrono.getRecordBylevel(jeu.level);
    if (jeu.record) var record = jeu.record.split("#");
    var panel = jeu.scene.add.image(5, 5, "timePanel");
    panel.setOrigin(0, 0).setScrollFactor(0).setScale(1);
    panel.scaleX = 1.5;
    this.nomRecordText = jeu.scene.add.text(35, 31, record ? record[1] : "", configNameRecord).setOrigin(0, 0);
    this.recordText = jeu.scene.add.text(35, 44, record ? record[0] : "00:00:00", configRecord).setOrigin(0, 0);
    this.chronoText = jeu.scene.add.text(26, 70, "00:00:00", configChrono).setOrigin(0, 0);

    this.nomRecordText.setScrollFactor(0);
    this.recordText.setScrollFactor(0);
    this.chronoText.setScrollFactor(0);
  },

  afficherScore: function () {
    this.scoreText = jeu.scene.add
      .bitmapText(20, 20, "kingOldSchool", "SCORE")
      .setTintFill(0xf4661b, 0x000000, 0xf4661b, 0x000000);
    this.scoreText.setScrollFactor(0);
  },

  afficherfinLevel: function () {
    if (jeu.player.kuruCenter.x >= this.positionEnd.x + 2) {
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
        "Click to next level",
        {
          font: "16px Courier",
          fill: "#00ff00",
        }
      );
      this.winText.on("pointerdown", function () {
        jeu.world.nextLevel();
      });
    }
  },
  nextLevel: function () {
    jeu.level++;
    if (jeu.level === 6) jeu.level = 1;
    jeu.player.forceRotation = 1;
    jeu.win = false;
    gestionChrono.chronoSend = false;
    jeu.timer.remove();
    jeu.minute = 0;
    jeu.stringMin = "0";
    jeu.seconde = 0;
    jeu.stringSeconde = "0";
    jeu.mil = 0;
    jeu.scene.scene.restart();
  },
};
