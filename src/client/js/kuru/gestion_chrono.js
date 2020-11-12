var gestionChrono = {
  chronoSend: false,
  chronos: null,
  button: null,
  isSort: false,

  getChrono: function (playerName, level, chrono) {
    if (jeu.win) {
      if (!this.chronoSend) {
        this.chronoSend = true;
        const bodyChrono = {
          playerName: playerName,
          level: level,
          chrono: chrono,
        };
        this.postChrono(bodyChrono);
      }
    }
  },

  postChrono: async function (body) {
    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await fetch("/chrono", options);
      if (!res.ok) {
        throw new Error(res.status);
      }
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
    this.chronos = chronos.chrono;
    gestionChrono.afficherChronos();
  },
  afficherChronos: function () {
    this.chronos.sort(this.triByLevelAndChrono);
    let txt = "";
    txt += `<table id='tabChrono' class='table table-striped w-50 mx-auto'>
      <thead>
          <tr>
          <th><button type='submit' id='buttonTrieTabPlayerName' class="btn btn-link">Pseudo</button></th>
          <th>level</th>
          <th>Chrono</th>
        </tr>
      <tbody>`;
    for (let ligne in this.chronos) {
      txt += `<tr>
        <td>${this.chronos[ligne].playerName}</td>
        <td>${this.chronos[ligne].level}</td>
        <td>${this.chronos[ligne].chrono}</td>
      </tr>`;
    }
    txt += "</tbody></table>";
    $("#chrono").html(txt);

    $("#buttonTrieTabPlayerName").on("click", () => {
      !this.isSort ? (this.isSort = true) : (this.isSort = false);
      this.chronoByName();
    });
  },
  chronoByName: function () {
    let chronosNoOrder = this.chronos;
    let chronosOrderByName = [...chronosNoOrder].sort(this.triByNom);

    let chronos;
    this.isSort ? (chronos = chronosOrderByName) : (chronos = chronosNoOrder);

    for (let ligne in chronos) {
      let txt = "";
      txt += `<tr>
        <td>${chronos[ligne].playerName}
        <td>${chronos[ligne].level}</td>
        <td>${chronos[ligne].chrono}</td>
      </tr>`;
      $(`#tabChrono tr:eq(${parseInt(ligne) + 1})`).replaceWith($(txt));
    }
  },
  triByLevelAndChrono: function (a, b) {
    var critere,
      criteres = ["level", "chrono"];
    for (critere in criteres) {
      if (a[criteres[critere]] != b[criteres[critere]]) {
        return a[criteres[critere]] > b[criteres[critere]] ? 1 : -1;
      }
    }
    return 0;
  },
  triByNom: function (a, b) {
    criteres = "playerName";
    const first = a[criteres].toUpperCase();
    const second = b[criteres].toUpperCase();
    if (first != second) {
      return first > second ? 1 : -1;
    }

    return 0;
  },
};
const myRequest = new Request("/chrono");
fetch(myRequest).then((response) =>
  response.json().then((data) => {
    gestionChrono.getChronos(data);
  })
);
