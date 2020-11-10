var config = {
  type: Phaser.AUTO,
  backgroundColor: "#82c7ff",
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
    },
  },
  scene: [Preloader, Game],
};
var game = new Phaser.Game(config);
