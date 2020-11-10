const puissance4 = {
  //init variable
  plateau: [],
  nbColonne: 7,
  nbLigne: 6,
  joueur1: "X",
  joueur2: "O",

  AfficherPlateau: function (joueur) {
    const jeux = $(".plateau");
    jeux.html("");
    let content = "<table class='mx-auto mt-2'>";
    for (let i = 0; i < this.nbLigne; i++) {
      content += "<tr>";
      for (let j = 0; j < this.nbColonne; j++) {
        content += "<td class='border text-center' style='width:100px; height:100px'>";
        if (this.plateau[i][j] === 0) {
          content += "";
        } else if (this.plateau[i][j] === 1) {
          content += `<img src='/puissance4//pionJaune.png' id="${i}${j}" class='objet img-fluid'/>`;
        } else if (this.plateau[i][j] === 2) {
          content += `<img src='/puissance4/pionRouge.png' id="${i}${j}" name="pion" class='objet img-fluid'/>`;
        }
        content += "</td>";
      }
    }
    content += "<tr>";
    content += '<td><button type="button" name="buttonColonne" class="btn" onClick="jouer(0)">Colonne 1</button></td>';
    content += '<td><button type="button" name="buttonColonne" class="btn" onClick="jouer(1)">Colonne 2</button></td>';
    content += '<td><button type="button" name="buttonColonne" class="btn" onClick="jouer(2)">Colonne 3</button></td>';
    content += '<td><button type="button" name="buttonColonne" class="btn" onClick="jouer(3)">Colonne 4</button></td>';
    content += '<td><button type="button" name="buttonColonne" class="btn" onClick="jouer(4)">Colonne 5</button></td>';
    content += '<td><button type="button" name="buttonColonne" class="btn" onClick="jouer(5)">Colonne 6</button></td>';
    content += '<td><button type="button" name="buttonColonne" class="btn" onClick="jouer(6)">Colonne 7</button></td>';
    content += "</tr>";
    content += "</table>";
    jeux.html(content);
    if (joueur === 1) {
      $("button[name='buttonColonne']").addClass("btn-outline-warning");
    } else if ($("#IA")[0].checked && joueur === 2) {
      $("button[name='buttonColonne']").addClass("btn-outline-danger").attr("disabled", "disabled");
    } else $("button[name='buttonColonne']").addClass("btn-outline-danger");
  },

  jouerCase: function (joueur, ligne, colonne) {
    this.plateau[ligne][colonne] = joueur;
  },

  /**
   * Function qui retourne la première ligne vide d'une colonne
   * @param {Number} colonne retourne -1 si la colonne est pleine
   */
  retournerFirstLigneVideDeColonne: function (colonne) {
    for (let i = this.nbLigne - 1; i >= 0; i--) {
      if (this.verifierCaseVide(i, colonne)) return i;
    }
    return -1;
  },

  /**
   * Fonction qui retourne true si une case est vide
   * @param {Number} ligne
   * @param {Number} colonne
   */
  verifierCaseVide: function (ligne, colonne) {
    return this.plateau[ligne][colonne] === 0;
  },

  /**
   * Fonction permetant de vérifier si un joueur a gagné en ligne ou en colonne ou en diagonal
   * @param {Number} joueur
   */
  verificationFinJeu: function (joueur) {
    if (
      this.verificationLignePuissance4(joueur) ||
      this.verificiationColonnePuissance4(joueur) ||
      this.verificationDiagonalPuissance4(joueur)
    ) {
      return true;
    }
    return false;
  },

  /**
   * Fonction permettant de vérifier si un il y a un puissance 4 en ligne
   * @param {Number} joueur
   */
  verificationLignePuissance4: function (joueur) {
    for (var i = this.nbLigne - 1; i >= 0; i--) {
      for (var j = 0; j < this.nbColonne - 3; j++) {
        if (
          this.plateau[i][j] === joueur &&
          this.plateau[i][j + 1] === joueur &&
          this.plateau[i][j + 2] === joueur &&
          this.plateau[i][j + 3] === joueur
        )
          return true;
      }
    }
    return false;
  },

  /**
   * Fonction permettant de vérifier si un il y a un puissance 4 en colonne
   * @param {Number} joueur
   */
  verificiationColonnePuissance4: function (joueur) {
    for (var i = 0; i < this.nbColonne; i++) {
      for (var j = this.nbLigne - 4; j >= 0; j--) {
        if (
          this.plateau[j][i] === joueur &&
          this.plateau[j + 1][i] === joueur &&
          this.plateau[j + 2][i] === joueur &&
          this.plateau[j + 3][i] === joueur
        )
          return true;
      }
    }
    return false;
  },

  /**
   * Fonction permettant de vérifier si un il y a un puissance 4 en diagonal
   * @param {Number} joueur
   */
  verificationDiagonalPuissance4: function (joueur) {
    for (let l = this.nbLigne - 1; l >= 3; l--) {
      for (let c = 0; c < this.nbColonne; c++) {
        if (
          this.plateau[l][c] === joueur &&
          this.plateau[l - 1][c + 1] === joueur &&
          this.plateau[l - 2][c + 2] === joueur &&
          this.plateau[l - 3][c + 3] === joueur
        )
          return true;
        if (
          this.plateau[l][c] === joueur &&
          this.plateau[l - 1][c - 1] === joueur &&
          this.plateau[l - 2][c - 2] === joueur &&
          this.plateau[l - 3][c - 3] === joueur
        )
          return true;
      }
    }
    return false;
  },
  initPuissance4: function () {
    this.plateau = toolbox.initPlateau(this.nbLigne, this.nbColonne, 0);
  },
};
