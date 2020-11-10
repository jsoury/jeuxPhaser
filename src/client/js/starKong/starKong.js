var player;
var cursors;
var platforms;
var stars;
var bombs;
var score = 0;
var scoreText;
var gameOverText;
var gameOver = false;
var font;
var jeu = {
  scene: null,
  controlButton: controlButton,
  adjustScreen: adjustScreen,
};

var Preloader = new Phaser.Class({
  initialize: function Preloader() {
    Phaser.Scene.call(this, { key: "preloader" });
  },

  preload: function () {
    this.load.image("sky", "/starKong/sky.png");
    this.load.image("ground", "/starKong/platform.png");
    this.load.image("star", "/starKong/star.png");
    this.load.image("bomb", "/starKong/bomb.png");
    this.load.image("gameOver", "/starKong/game_over.png");
    this.load.spritesheet("kong", "/starKong/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
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
    jeu.scene = this;
    console.log("%c Game ", "background: green; color: white; display: block;");
    var positionCameraCentreLargeurX = this.cameras.main.centerX;
    var positionCameraCentreHauteurY = this.cameras.main.centerY;
    this.add.image(positionCameraCentreLargeurX, positionCameraCentreHauteurY, "sky");
    // on afiche le score en 16 16 avec une police de 32px
    scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
    });
    // creation des platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(50, 250, "ground");
    platforms.create(600, 400, "ground");
    platforms.create(750, 220, "ground");
    platforms.create(positionCameraCentreLargeurX, 568, "ground").setScale(2).refreshBody();

    // creation du player
    player = this.physics.add.sprite(100, 450, "kong");
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    //ajout de la collision entre le player et les platforms
    this.physics.add.collider(player, platforms);

    //ajout des touche up down left right space and tab
    cursors = this.input.keyboard.createCursorKeys();

    //creation des animations du personnage
    this.anims.create({
      key: "moveLeft",
      frames: this.anims.generateFrameNumbers("kong", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "moveRight",
      frames: this.anims.generateFrameNumbers("kong", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "moveStop",
      frames: [{ key: "kong", frame: 4 }],
      frameRate: 20,
    });

    //répéter la création d'étoiles 11 fois (soit au total 12 fois).
    //On définit les coordonnées de ces étoiles avec l’attribut setXY.
    //Nous plaçons la première étoile en coordonnées (12, 0),
    //puis espaçons les autres de 70 pixels vers la droite à chaque fois.
    stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    //ajout de la collision entre le player et les platforms
    this.physics.add.collider(stars, platforms);

    //la fonction collectStar()sera appelée à chaque fois que l’on ramasse une étoile, et cette dernière disparaitra.
    this.physics.add.overlap(player, stars, this.collectStar, null, this);

    // on itere sur les étoiles
    stars.children.iterate(function (child) {
      // et on ajoute du rebond à nos étoiles avec un float aleatoir entre 0.4 et 0.8
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);

    //on execute la fonction hitBomb si player collider avec une bomb
    this.physics.add.collider(player, bombs, this.hitBomb, null, this);
    jeu.controlButton.pauseControlButton();
    jeu.controlButton.muteControlButton();
    jeu.controlButton.resetControlButton();
  },
  update: function () {
    adjustScreen.adjustScreen();
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("moveLeft", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("moveRight", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("moveStop");
    }
    if (cursors.space.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
    if (gameOver) {
      this.scene.start("gameover");
      gameOver = false;
    }
  },

  collectStar: function (player, star) {
    star.disableBody(true, true);
    if (stars.countActive(true) === 0) {
      var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1); //On met un coefficient de rebond de la bombe à 1
      bomb.setCollideWorldBounds(true); //On fait en sorte que la bombe ne sorte pas des limites du monde
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); //On ajoute une vitesse aléatoire à la bombe
      bomb.allowGravity = false; //On empêche la bombe d’être sujette à la gravité
      stars.children.iterate(function (star) {
        star.enableBody(true, star.x, 0, true, true);
        score += 10;
        scoreText.setText("SCORE:" + score);
      });
    }
  },
  hitBomb: function () {
    gameOver = true;
  },
});

var GameOver = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function GameOver() {
    Phaser.Scene.call(this, { key: "gameover" });
    window.OVER = this;
  },

  create: function () {
    console.log("%c GameOver ", "background: green; color: white; display: block;");
    scoreText = this.add.text(340, 110, "Score: " + score, {
      fontSize: "32px Courier",
      fill: "#00ff00",
    });
    this.add.sprite(400, 300, "gameOver");

    this.add.text(500, 500, "Click to restart", {
      font: "16px Courier",
      fill: "#00ff00",
    });

    this.input.once(
      "pointerup",
      function (event) {
        this.scene.start("game");
      },
      this
    );
  },
});

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [Preloader, Game, GameOver],
};

var game = new Phaser.Game(config);
