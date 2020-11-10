var gestionChrono = {
  chronoSend: false,
  chronos: null,

  getChrono: function (playerName, level, chrono) {
    if (jeu.win) {
      if (!this.chronoSend) {
        this.chronoSend = true;
        this.postChrono(playerName, level, chrono);
      }
    }
  },

  postChrono: function (playerName, level, chrono) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/chrono");
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    var jsonStr = JSON.stringify({
      playerName: playerName,
      level: level,
      chrono: chrono,
    });
    xhr.send(jsonStr);
  },

  getRecordBylevel: function (level) {
    tabChronos = [];
    var chronos = this.chronos;
    for (let ligne in chronos) {
      if (chronos[ligne].level === level) {
        tabChronos.push(chronos[ligne].chrono + "#" + chronos[ligne].playerName);
      }
    }
    tabChronos.sort();
    var record = tabChronos[0];
    return record;
  },

  getChronos: function (chronos) {
    var tabChrono = [];
    for (let chrono in chronos.chrono) {
      tabChrono.push(chronos.chrono[chrono]);
    }
    this.chronos = tabChrono;
  },
};
const myRequest = new Request("/chrono");
fetch(myRequest).then((response) =>
  response.json().then((data) => {
    gestionChrono.getChronos(data);
  })
);
