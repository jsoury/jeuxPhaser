class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    // this.load.image("background", "./assets/img/Space.jpg");
    // this.load.image("speaker", "./assets/img/speaker.png");
    // this.load.audio("loading", "./assets/sounds/Ballistics.mp3");
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    //this.add.image(0, 0, "background").setOrigin(0, 0).setScale(0.6);
    // this.add
    //   .image(780, 580, "speaker")
    //   .setScale(0.1)
    //   .setInteractive({ useHandCursor: true })
    //   .on("pointerdown", () => music.play());
    this.add.text(280, 350, `Your Game Name`, {
      fontSize: "32px",
      fill: "#FF0000",
      fontStyle: "bold",
    });
    this.add
      .text(225, 400, `Click Here To Play!`, {
        fontSize: "32px",
        fill: "#FF0000",
        fontStyle: "bold",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("preloader"));

    // const music = this.sound.add("loading", {
    //   mute: false,
    //   volume: 0.15,
    //   rate: 1,
    //   detune: 0,
    //   seek: 0,
    //   loop: true,
    //   delay: 0,
    // });
  }
}

export default MenuScene;
