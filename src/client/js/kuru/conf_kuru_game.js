// import MenuScene from "./scene/menuScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  backgroundColor: "#228822",
  parent: "kuruGame",
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: [Preloader, Game],
};
const game = new Phaser.Game(config);

// game.scene.add("MenuScene", MenuScene);
