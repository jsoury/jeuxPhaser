var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
    },
  },
};

var game = new Phaser.Game(config);
var player;
var platforms;
var vKey;
var bKey;
var btnZoomUp;
var btnZoomDown;
var isLeftDown = false;
var isRightDown = false;
var isKickDown = false;
var isPunchDown = false;
var zombie = null;
var tweenZombie = null;
var retroFront = null;

var clickUp = false;
var clickDown = false;
var cursor = null;
var isReadyToKick = true;

function preload() {
  this.load.spritesheet("roberto", "/roberto/roberto.png", {
    frameWidth: 96,
    frameHeight: 128,
  });
  this.load.image("ground", "/roberto/platform.png");
  this.load.image("backgroundDesert", "/roberto/colored_desert.png");
  this.load.image("zombie", "/roberto/character_zombie_slide.png");
  this.load.image("kingOldSchool", "/font/knighthawks_font.png");
  this.load.image("up", "boutton/blue_sliderUp.png");
  this.load.image("down", "boutton/blue_sliderDown.png");
  this.load.audio("kick", "/sounds/impactPunch_heavy_000.ogg");
  this.load.audio("go", "/sounds/go.ogg");
  this.load.audio("ready", "/sounds/ready.ogg");
}

function create() {
  var config = {
    image: "kingOldSchool",
    width: 31,
    height: 25,
    chars: Phaser.GameObjects.RetroFont.TEXT_SET2,
    charsPerRow: 10,
    spacing: { x: 1, y: 1 },
    fill: "#000",
  };
  this.cache.bitmapFont.add("kingOldSchool", Phaser.GameObjects.RetroFont.Parse(this, config));
  this.add.bitmapText(10, 50, "kingOldSchool", "SCORE: 0");
  this.sound.play("ready", { volume: 0.2 });
  // this.physics.game.setBounds(0, 0, 2000, 600);
  // this.cameras.main.startFollow(player);
  // this.cameras.main.setBounds(0, 0, 2000, 600);
  var positionCameraCentreLargeurX = this.cameras.main.centerX;
  var positionCameraCentreHauteurY = this.cameras.main.centerY;
  this.add.sprite(positionCameraCentreLargeurX, positionCameraCentreHauteurY, "backgroundDesert");
  platforms = this.physics.add.staticGroup();
  platforms.create(50, 250, "ground");
  platforms.create(600, 400, "ground");
  platforms.create(750, 220, "ground");
  platforms.create(positionCameraCentreLargeurX, 568, "ground").setScale(2).refreshBody();

  player = this.physics.add.sprite(100, 400, "player");

  //ajout de la collision entre le player et les platforms
  this.physics.add.collider(player, platforms);

  zombie = this.add.sprite(600, 400, "zombie");
  zombie.flipX = true;
  tweenZombie = this.tweens.add({
    targets: zombie,
    x: 750,
    ease: "Linear",
    duration: 6000,
    yoyo: true,
    repeat: -1,
    onSart: function () {},
    onComplete: function () {},
    onYoyo: function () {
      zombie.flipX = !zombie.flipX;
    },
    onRepeat: function () {
      zombie.flipX = !zombie.flipX;
    },
  });

  btnZoomUp = this.add.sprite(650, 500, "up").setInteractive();
  btnZoomDown = this.add.sprite(650, 550, "down").setInteractive();
  Zoom();

  //Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right, and also Space Bar and shift.
  cursor = this.input.keyboard.createCursorKeys();
  bKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
  vKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);

  this.anims.create({
    key: "robertoMove",
    frames: this.anims.generateFrameNumbers("roberto", { start: 8, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "robertoStop",
    frames: [{ key: "roberto", frame: 2 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "robertoKick",
    frames: [{ key: "roberto", frame: 1 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "robertoPunch",
    frames: [{ key: "roberto", frame: 0 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "zombieWalk",
    frames: [{ key: "zombieWalk0" }, { key: "zombieWalk1" }, { key: "zombieWalk2" }],
    frameRate: 3,
    repeat: -1,
  });
}

function update(time, delta) {
  //console.log(tweenZombie);
  updateZoom();
  CommandePlayer();
  // zombie.setFlip(false, false);
  //zombie.anims.play("zombieWalk", true);
}
// //changer l'origine de l'image X Y
// player.setOrigin(0, 0);
function CommandePlayer() {
  if (isKickDown && isReadyToKick) {
    isReadyToKick = false;
    player.anims.play("robertoKick");
    this.sound.play("kick", { volume: 0.5 });
  } else if (isPunchDown) {
    player.anims.play("robertoPunch");
  } else if (isLeftDown) {
    player.x -= 5;
    player.setFlip(true, false); // inverse axe X Y
    player.anims.play("robertoMove", true);
  } else if (isRightDown) {
    player.x += 5;
    player.setFlip(false, false);
    player.anims.play("robertoMove", true);
  } else {
    player.anims.play("robertoStop");
  }

  if (cursor.left.isDown) {
    isLeftDown = true;
  }
  if (cursor.left.isUp) {
    isLeftDown = false;
  }
  if (cursor.right.isDown) {
    isRightDown = true;
  }
  if (cursor.right.isUp) {
    isRightDown = false;
  }
  if (vKey.isDown) {
    isKickDown = true;
  }
  if (vKey.isUp) {
    isKickDown = false;
    isReadyToKick = true;
  }
  if (bKey.isDown) {
    isPunchDown = true;
  }
  if (bKey.isUp) {
    isPunchDown = false;
  }
}

function Zoom() {
  //clique de sourie
  btnZoomUp.on("pointerdown", function () {
    clickUp = true;
  });

  //relacher  le clicque sourie
  btnZoomUp.on("pointerup", function () {
    clickUp = false;
  });

  //sortir du bouton
  btnZoomUp.on("pointerout", function () {
    clickUp = false;
  });

  //clique de sourie
  btnZoomDown.on("pointerdown", function () {
    clickDown = true;
  });

  //relacher  le clicque sourie
  btnZoomDown.on("pointerup", function () {
    clickDown = false;
  });

  //sortir du bouton
  btnZoomDown.on("pointerout", function () {
    clickDown = false;
  });
}
function updateZoom() {
  if (clickUp) {
    player.setScale(player.scaleX + 0.1, player.scaleY + 0.1); //Augmenter la taille de l'image
  }
  if (clickDown) {
    player.setScale(player.scaleX - 0.1, player.scaleY - 0.1);
  }
}
// var text = jeu.scene.add
//   .text(225, 400, `Click Here To Play!`, {
//     fontSize: "32px",
//     fill: "#FF0000",
//     fontStyle: "bold",
//   })
//   .setInteractive({ useHandCursor: true })
//   .on("pointerdown", () => this.scene.start("game"));

//this.scene.start("game");

//   tweenZombie: function () {
//     zombie = this.add.sprite(600, 400, "zombie");
//     zombie.flipX = true;
//     tweenZombie = this.tweens.add({
//       targets: zombie,
//       x: 750,
//       ease: "Linear",
//       duration: 6000,
//       yoyo: true,
//       repeat: -1,
//       onSart: function () {},
//       onComplete: function () {},
//       onYoyo: function () {
//         zombie.flipX = !zombie.flipX;
//       },
//       onRepeat: function () {
//         zombie.flipX = !zombie.flipX;
//       },
//     });
//   },

// this.physics.world.setBounds(0, 0, 2000, 600);
// this.cameras.main.startFollow(player);
// this.cameras.main.setBounds(0, 0, 2000, 600);

// //changer l'origine de l'image X Y
// player.setOrigin(0, 0);

// var positionCameraCentreLargeurX = this.cameras.main.centerX;
// var positionCameraCentreHauteurY = this.cameras.main.centerY;

// CommandePlayer: function () {
//   if (isKickDown && isReadyToKick) {
//     isReadyToKick = false;
//     player.anims.play("robertoKick");
//     this.sound.play("kick", { volume: 0.5 });
//   } else if (isPunchDown) {
//     player.anims.play("robertoPunch");
//   } else if (isLeftDown) {
//     player.x -= 5;
//     player.setFlip(true, false); // inverse axe X Y
//     player.anims.play("robertoMove", true);
//   } else if (isRightDown) {
//     player.x += 5;
//     player.setFlip(false, false);
//     player.anims.play("robertoMove", true);
//   } else {
//     player.anims.play("robertoStop");
//   }
//   if (cursors.space.isDown && player.body.touching.down) {
//     player.setVelocityY(-330);
//   }

//   if (cursors.left.isDown) {
//     isLeftDown = true;
//   }
//   if (cursors.left.isUp) {
//     isLeftDown = false;
//   }
//   if (cursors.right.isDown) {
//     isRightDown = true;
//   }
//   if (cursors.right.isUp) {
//     isRightDown = false;
//   }
//   if (vKey.isDown) {
//     isKickDown = true;
//   }
//   if (vKey.isUp) {
//     isKickDown = false;
//     isReadyToKick = true;
//   }
//   if (bKey.isDown) {
//     isPunchDown = true;
//   }
//   if (bKey.isUp) {
//     isPunchDown = false;
//   }
// },

// btnCommande: function () {
//   btnUp = this.add.sprite(750, 530, "up").setInteractive();
//   btnDown = this.add.sprite(750, 575, "down").setInteractive();
//   //clique de sourie
//   btnUp.on("pointerdown", function () {
//     clickUp = true;
//   });

//   //relacher  le clicque sourie
//   btnUp.on("pointerup", function () {
//     clickUp = false;
//   });

//   //sortir du bouton
//   btnUp.on("pointerout", function () {
//     clickUp = false;
//   });

//   //clique de sourie
//   btnDown.on("pointerdown", function () {
//     clickDown = true;
//   });

//   //relacher  le clicque sourie
//   btnDown.on("pointerup", function () {
//     clickDown = false;
//   });

//   //sortir du bouton
//   btnDown.on("pointerout", function () {
//     clickDown = false;
//   });
// },
// updatebtnCommande: function () {
//   if (clickUp && player.body.touching.down) {
//     player.setVelocityY(-330);
//   }
//   if (clickDown) {
//     player.setScale(player.scaleX - 0.1, player.scaleY - 0.1);
//   }
// },
