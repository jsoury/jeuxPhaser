const adjustScreen = {
  adjustScreen: function () {
    var canvas = document.querySelector("canvas");
    var windowWidth = document.getElementById("game-controls").offsetWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = config.width / config.height;
    if (windowHeight > 600) windowHeight = 600;
    if (windowRatio < gameRatio) {
      canvas.style.width = windowWidth + "px";
      canvas.style.height = windowWidth / gameRatio + "px";
    } //else {
    //   canvas.style.width = windowHeight * gameRatio;
    //   canvas.style.height = windowHeight + "px";
    // }
  },
};
