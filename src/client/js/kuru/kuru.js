var jeu = {
  scene: null,
  world: world,
  player: player,
  gameOver: false,
  win: false,
  controlButton: controlButton,
  adjustScreen: adjustScreen,
  level: 1,
  timer: null,
  minute: 0,
  stringMin: "0",
  seconde: 0,
  stringSeconde: "0",
  mil: 0,
  chrono: null,
  playerName: null,
  record: null,
};

var Preloader = new Phaser.Class({
  initialize: function Preloader() {
    Phaser.Scene.call(this, { key: "preloader" });
  },
  preload: function () {
    jeu.scene = this;
    jeu.scene.load.image("kingOldSchool", "/font/knighthawks_font_filled.png");

    jeu.scene.load.image("tileSheetTerrain", "/kuru/images/terrainTiles_default.png");
    jeu.scene.load.image("tileSheetObjet", "/kuru/images/tile-sheet-objet.png");
    jeu.scene.load.image("tileSheetPerso", "/kuru/images/tilesPerso.png");
    jeu.scene.load.spritesheet("tileSheetBumper", "/kuru/images/Tiles_sheet_bumper_64.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    jeu.scene.load.tilemapTiledJSON("map1", "/kuru/json/kurumap1.json");
    jeu.scene.load.tilemapTiledJSON("map2", "/kuru/json/kurumap2.json");
    jeu.scene.load.tilemapTiledJSON("map3", "/kuru/json/kurumap3.json");
    jeu.scene.load.tilemapTiledJSON("map4", "/kuru/json/kurumap4.json");
    jeu.scene.load.image("piece1", "/kuru/images/piece1.png");
    jeu.scene.load.image("piece2", "/kuru/images/piece2.png");
    jeu.scene.load.image("kuru", "/kuru/images/kuru.png");
    jeu.scene.load.image("kuruBarre", "/kuru/images/kuru_barre.png");
    jeu.scene.load.image("kuruCentre", "/kuru/images/kuru_centre.png");
    jeu.scene.load.image("kuruExtremite", "/kuru/images/kuru_extremite.png");
    jeu.scene.load.image("timePanel", "/ui/metalPanel_red.png");
    jeu.scene.load.image("BackGround", "/kuru/images/background.png");
    this.load.html("nameform", "/text/nameform.html");

    jeu.scene.load.audio("win", "/sounds/marioWin.ogg");
    jeu.scene.load.audio("soundPiece", "/sounds/mario_ring.ogg");
    jeu.scene.load.audio("soundRestart", "/sounds/impactPlate_light_000.ogg");
  },
  create: function () {
    console.log("%c Preloader ", "background: green; color: white; display: block;");

    jeu.scene.add.image(400, 300, "BackGround");

    var text = this.add.text(300, 50, "KURU KURU GAME", { color: "black", fontSize: "50px" });
    var element = jeu.scene.add.dom(400, 600).createFromCache("nameform");

    element.addListener("click");
    element.on("click", function (event) {
      if (event.target.name === "playButton") {
        var inputText = this.getChildByName("nameField");
        if (inputText.value !== "") {
          this.removeListener("click");
          //  Hide the login element
          this.setVisible(false);
          jeu.playerName = inputText.value;
        } else {
          this.scene.tweens.add({
            targets: text,
            alpha: 0.2,
            duration: 250,
            ease: "Power3",
            yoyo: true,
          });
        }
      }
    });
    this.tweens.add({
      targets: element,
      y: 500,
      duration: 3000,
      ease: "Power3",
    });
  },
  update: function (time, delta) {
    adjustScreen.adjustScreen();
    if (jeu.playerName) this.scene.start("game");
  },
});

var Game = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function Game() {
    Phaser.Scene.call(this, { key: "game" });
    window.GAME = this;
  },
  create: function () {
    console.log("%c Game ", "background: green; color: white; display: block;");
    jeu.scene = this;
    jeu.gameOver = false;
    jeu.win = false;
    gestionChrono.chronoSend = false;
    jeu.world.animerPiece();
    jeu.world.animerBumper();
    jeu.world.initialiserWorld();
    jeu.player.initialiserPlayer();
    jeu.world.gererCollider();
    jeu.world.gererCamera();
    jeu.world.creerChrono();
    jeu.controlButton.pauseControlButton();
    jeu.controlButton.muteControlButton();
    jeu.controlButton.resetControlButton();
  },

  update: function (time, delta) {
    adjustScreen.adjustScreen();
    jeu.player.gererRotation();
    jeu.player.gererDeplacement();
    jeu.world.getMilisecond();
    jeu.world.updateChrono();
    jeu.world.gestionChrono();
    gestionChrono.getChrono(jeu.playerName, jeu.level, jeu.chrono);
  },
});
