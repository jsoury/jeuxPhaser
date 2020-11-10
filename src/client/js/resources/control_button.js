const controlButton = {
  pause: false,
  mute: false,
  reset: false,
  pauseControlButton: function () {
    $(".pause-button").on("click", function () {
      if (this.pause) {
        this.pause = false;
        jeu.scene.scene.resume("game");
      } else {
        this.pause = true;
        jeu.scene.scene.pause("game");
      }
    });
  },
  muteControlButton: function () {
    $(".mute-button").on("click", function () {
      if (!this.mute) {
        this.mute = true;
        jeu.scene.sound.setMute(this.mute);
      } else {
        this.mute = false;
        jeu.scene.sound.setMute(this.mute);
      }
    });
  },
  resetControlButton: function () {
    $(".reset-button").on("click", function () {
      var scene = jeu.scene.scene.get("game");
      jeu.scene.scene.restart(scene);
    });
  },
};
