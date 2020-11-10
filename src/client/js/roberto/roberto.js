var jeu = {
  scene: null,
  world: World,
  player: Player,
  robot: Robot,
  controlButton: controlButton,
  adjustScreen: adjustScreen,
  gameOver: false,
  win: false,
  pause: false,
  mute: false,
  reset: false,
};

var Preloader = new Phaser.Class({
  initialize: function Preloader() {
    Phaser.Scene.call(this, { key: "preloader" });
  },
  preload: function () {
    jeu.scene = this;

    jeu.scene.load.atlas("robertoAtlas", "/roberto/images/spriteSheetRoberto.png", "/roberto/json/robertoAtlas.json");
    jeu.scene.load.atlas("robotAtlas", "/roberto/images/spriteSheetRobot.png", "/roberto/json/robotAtlas.json");

    jeu.scene.load.image("backgroundDesert", "/roberto/images/colored_desert.png");

    jeu.scene.load.image("mapTiles", "/roberto/images/platformPack_tilesheet.png");
    jeu.scene.load.tilemapTiledJSON("mapJSON", "/roberto/json/mapRoberto.json");

    jeu.scene.load.image("gameOver", "/roberto/images/game_over.png");

    jeu.scene.load.image("sparkWhite", "/particles/white.png");
    jeu.scene.load.image("sparkBlue", "/particles/blue.png");
    jeu.scene.load.image("sparkRed", "/particles/red.png");

    jeu.scene.load.image("kingOldSchool", "/font/knighthawks_font_filled.png");
    jeu.scene.load.image("wayne3D", "/font/WAYNE_3D.png");

    jeu.scene.load.image("up", "/boutton/blue_sliderUp.png");
    jeu.scene.load.image("down", "/boutton/blue_sliderDown.png");

    jeu.scene.load.audio("kick", "/sounds/impactPunch_heavy_000.ogg");
    jeu.scene.load.audio("go", "/sounds/go.ogg");
    jeu.scene.load.audio("ready", "/sounds/ready.ogg");
    jeu.scene.load.audio("getGemme", "/sounds/impactMetal_light_002.ogg");
    jeu.scene.load.audio("getKey", "/sounds/p-ping.mp3");
    jeu.scene.load.audio("loose", "/sounds/spaceman.wav");
    jeu.scene.load.audio("win", "/sounds/marioWin.ogg");
    jeu.scene.load.audio("jump", "/sounds/marioJump.ogg");
    jeu.scene.load.audio("robotDead", "/sounds/robot_dead.ogg");
  },
  create: function () {
    console.log("%c Preloader ", "background: green; color: white; display: block;");

    this.scene.start("game");
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
    jeu.world.key = false;

    jeu.world.score = 0;
    jeu.world.initWorld();
    jeu.player.initialiserPlayer();
    jeu.player.animationPlayer();
    jeu.robot.initialiserRobot();
    jeu.robot.animationRobot();
    jeu.robot.moveRobot();
    jeu.world.gererCollider();

    jeu.player.genererComandeClavier();

    jeu.world.gererCamera();

    jeu.controlButton.pauseControlButton();
    jeu.controlButton.muteControlButton();
    jeu.controlButton.resetControlButton();
  },

  update: function (time, delta) {
    adjustScreen.adjustScreen();
    jeu.player.gererDeplacement();
  },
});
