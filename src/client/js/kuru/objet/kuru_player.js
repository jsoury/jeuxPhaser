var player = {
  cursors: null,
  kuruBarre: null,
  kuruCenter: null,
  extremiteKuru1: null,
  extremiteKuru2: null,
  forceRotation: 1,

  initialiserPlayer: function () {
    this.kuruBarre = jeu.scene.physics.add
      .sprite(jeu.world.positionStart.x, jeu.world.positionStart.y, "kuruBarre")
      .setScale(1.5);

    this.kuruCenter = jeu.scene.physics.add
      .sprite(jeu.world.positionStart.x, jeu.world.positionStart.y, "kuruCentre")
      .setScale(1.5);

    this.extremiteKuru1 = jeu.scene.physics.add
      .sprite(jeu.world.positionStart.x + this.kuruBarre.width, jeu.world.positionStart.y, "kuruExtremite")
      .setScale(1.5);

    this.extremiteKuru2 = jeu.scene.physics.add
      .sprite(jeu.world.positionStart.x - this.kuruBarre.width, jeu.world.positionStart.y, "kuruExtremite")
      .setScale(1.5);

    this.cursors = jeu.scene.input.keyboard.createCursorKeys();
  },

  generatePlayerAnimations: function () {},

  gererDeplacement: function () {
    if (!jeu.gameOver && !jeu.win) {
      if (this.cursors.left.isDown) {
        this.kuruCenter.x -= 5;
        if (this.cursors.up.isDown) {
          this.kuruCenter.y -= 5;
        } else if (this.cursors.down.isDown) {
          this.kuruCenter.y += 5;
        }
      } else if (this.cursors.right.isDown) {
        this.kuruCenter.x += 5;
        if (this.cursors.up.isDown) {
          this.kuruCenter.y -= 5;
        } else if (this.cursors.down.isDown) {
          this.kuruCenter.y += 5;
        }
      } else if (this.cursors.up.isDown) {
        this.kuruCenter.y -= 5;
      } else if (this.cursors.down.isDown) {
        this.kuruCenter.y += 5;
      }
    } else if (jeu.gameOver) {
      jeu.scene.physics.pause();
      //this.kuruCenter.setTint(0xff0000);
    } else {
      jeu.scene.physics.pause();
    }
    this.kuruBarre.x = this.kuruCenter.x;
    this.kuruBarre.y = this.kuruCenter.y;
  },

  gererRotation: function () {
    var angle = this.kuruBarre.angle + this.forceRotation;
    var center = { x: this.kuruCenter.x, y: this.kuruCenter.y };
    this.kuruBarre.setAngle(angle);
    //Phaser.Actions.RotateAroundDistance([this.extremiteKuru1], center, 0.05, this.kuruBarre.width - 30);
    this.extremiteKuru1.x = this.kuruCenter.x + (this.kuruBarre.width - 30) * Math.cos((angle * Math.PI) / 180);
    this.extremiteKuru1.y = this.kuruCenter.y + (this.kuruBarre.width - 30) * Math.sin((angle * Math.PI) / 180);
    var angleDeg1 = (Math.atan2(this.extremiteKuru1.y - center.y, this.extremiteKuru1.x - center.x) * 180) / Math.PI;
    this.extremiteKuru1.angle = angleDeg1 + 180;

    this.extremiteKuru2.x = this.kuruCenter.x - (this.kuruBarre.width - 30) * Math.cos((angle * Math.PI) / 180);
    this.extremiteKuru2.y = this.kuruCenter.y - (this.kuruBarre.width - 30) * Math.sin((angle * Math.PI) / 180);
    var angleDeg2 = (Math.atan2(this.extremiteKuru2.y - center.y, this.extremiteKuru2.x - center.x) * 180) / Math.PI;
    this.extremiteKuru2.angle = angleDeg2 + 180;
  },
};
