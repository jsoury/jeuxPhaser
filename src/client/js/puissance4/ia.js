const IA = {
  choixColone: function () {
    let tabColonne = this.getTableauCellulesPossibles();
    let meilleurColonne = 0;
    let tabMeilleurColonne = [0];
    for (let i = 1; i < tabColonne.length; i++) {
      if (tabColonne[i] > tabColonne[meilleurColonne]) {
        meilleurColonne = i;
        tabMeilleurColonne = new Array();
        tabMeilleurColonne.push(i);
      } else if (tabColonne[i] === tabColonne[meilleurColonne]) {
        tabMeilleurColonne.push(i);
      }
    }
    console.log(tabColonne);
    return tabMeilleurColonne[
      Math.floor(Math.random() * tabMeilleurColonne.length)
    ];
  },

  getTableauCellulesPossibles: function () {
    let tabColonne = [];
    for (let i = 0; i < puissance4.nbColonne; i++) {
      tabColonne.push(
        this.getPoidsCellule(puissance4.retournerFirstLigneVideDeColonne(i), i)
      );
    }
    return tabColonne;
  },
  getPoidsCellule: function (ligne, colonne) {
    if (ligne === -1) return 0; //si la colonne est pleine --> le poids à renvoyer sera de 0
    if (this.verifGagner(ligne, colonne, 2)) return 100; // vérifier si joueur 2 peut gagner (IA)
    if (this.verifGagner(ligne, colonne, 1)) return 99; // vérifier si joueur 1 peut gagner

    if (this.coupPerdant(ligne, colonne, 2)) return 0;

    let poids = 0;
    if (this.DefendreDeuxPion(ligne, colonne, 1)) poids += 20; // defense
    if (this.DefendreDeuxPion(ligne, colonne, 2)) poids += 20; // ataque
    poids += this.getPoidsBase(ligne, colonne);

    return poids;
  },
  getPoidsBase: function (ligne, colonne) {
    let poidsLigne = 0;
    let poidsColonne = 0;
    switch (ligne) {
      case 0:
        poidsLigne = 1;
        break;
      case 1:
        poidsLigne = 2;
        break;
      case 2:
        poidsLigne = 3;
        break;
      case 3:
        poidsLigne = 4;
        break;
      case 4:
        poidsLigne = 3;
        break;
      case 5:
        poidsLigne = 2;
        break;
    }
    switch (colonne) {
      case 0:
        poidsColonne = 1;
        break;
      case 1:
        poidsColonne = 2;
        break;
      case 2:
        poidsColonne = 3;
        break;
      case 3:
        poidsColonne = 3;
        break;
      case 4:
        poidsColonne = 3;
        break;
      case 5:
        poidsColonne = 2;
        break;
      case 6:
        poidsColonne = 1;
        break;
    }
    return poidsLigne * poidsColonne;
  },
  DefendreDeuxPion: function (ligne, colonne, joueur) {
    let cpt = 1;
    if (puissance4.plateau[ligne][colonne + 1] === joueur) {
      cpt++;
      if (
        puissance4.plateau[ligne][colonne + 2] === joueur &&
        puissance4.plateau[ligne][colonne + 3] === 0
      )
        cpt++;
    }
    if (puissance4.plateau[ligne][colonne - 1] === joueur) {
      cpt++;
      if (
        puissance4.plateau[ligne][colonne - 2] === joueur &&
        puissance4.plateau[ligne][colonne - 3] === 0
      )
        cpt++;
    }
    if (cpt > 2) return true;
  },
  verifGagner: function (ligne, colonne, joueur) {
    if (this.verifGagnerLigne(ligne, colonne, joueur)) return true;
    if (this.verifGagnerColonne(ligne, colonne, joueur)) return true;
    if (this.verifGagnerDiagonaleDroite(ligne, colonne, joueur)) return true;
    if (this.verifGagnerDiagonaleGauche(ligne, colonne, joueur)) return true;
  },
  verifGagnerLigne: function (ligne, colonne, joueur) {
    let cpt = 1;
    if (puissance4.plateau[ligne][colonne + 1] === joueur) {
      cpt++;
      if (puissance4.plateau[ligne][colonne + 2] === joueur) {
        cpt++;
        if (puissance4.plateau[ligne][colonne + 3] === joueur) {
          cpt++;
        }
      }
    }
    if (puissance4.plateau[ligne][colonne - 1] === joueur) {
      cpt++;
      if (puissance4.plateau[ligne][colonne - 2] === joueur) {
        cpt++;
        if (puissance4.plateau[ligne][colonne - 3] === joueur) {
          cpt++;
        }
      }
    }
    if (cpt > 3) return true;
  },
  verifGagnerColonne: function (ligne, colonne, joueur) {
    let cpt = 1;
    if (ligne < 3) {
      if (puissance4.plateau[ligne + 1][colonne] === joueur) {
        cpt++;
        if (puissance4.plateau[ligne + 2][colonne] === joueur) {
          cpt++;
          if (puissance4.plateau[ligne + 3][colonne] === joueur) {
            cpt++;
          }
        }
      }
    }
    if (cpt > 3) return true;
  },
  verifGagnerDiagonaleDroite: function (ligne, colonne, joueur) {
    let cpt = 1;
    if (
      ligne - 1 > 0 &&
      colonne + 1 <= puissance4.nbColonne &&
      puissance4.plateau[ligne - 1][colonne + 1] === joueur
    ) {
      cpt++;
      if (
        ligne - 2 > 0 &&
        colonne + 2 <= puissance4.nbColonne &&
        puissance4.plateau[ligne - 2][colonne + 2] === joueur
      ) {
        cpt++;
        if (
          ligne - 3 > 0 &&
          colonne + 3 <= puissance4.nbColonne &&
          puissance4.plateau[ligne - 2][colonne + 3] === joueur
        ) {
          cpt++;
        }
      }
    }
    if (
      ligne + 1 < puissance4.nbLigne &&
      colonne - 1 >= 0 &&
      puissance4.plateau[ligne + 1][colonne - 1] === joueur
    ) {
      cpt++;
      if (
        ligne + 2 < puissance4.nbLigne &&
        colonne - 2 >= 0 &&
        puissance4.plateau[ligne + 2][colonne - 2] === joueur
      ) {
        cpt++;
        if (
          ligne + 3 < puissance4.nbLigne &&
          colonne - 3 >= 0 &&
          puissance4.plateau[ligne + 3][colonne - 3] === joueur
        ) {
          cpt++;
        }
      }
    }
    if (cpt > 3) return true;
  },
  verifGagnerDiagonaleGauche: function (ligne, colonne, joueur) {
    let cpt = 1;
    if (
      ligne - 1 >= 0 &&
      colonne - 1 >= 0 &&
      puissance4.plateau[ligne - 1][colonne - 1] === joueur
    ) {
      cpt++;
      if (
        ligne - 2 >= 0 &&
        colonne - 2 >= 0 &&
        puissance4.plateau[ligne - 2][colonne - 2] === joueur
      ) {
        cpt++;
        if (
          ligne - 3 >= 0 &&
          colonne - 3 >= 0 &&
          puissance4.plateau[ligne - 2][colonne - 3] === joueur
        ) {
          cpt++;
        }
      }
    }
    if (
      ligne + 1 < puissance4.nbLigne &&
      colonne + 1 <= puissance4.nbColonne &&
      puissance4.plateau[ligne + 1][colonne + 1] === joueur
    ) {
      cpt++;
      if (
        ligne + 2 < puissance4.nbLigne &&
        colonne + 2 <= puissance4.nbColonne &&
        puissance4.plateau[ligne + 2][colonne + 2] === joueur
      ) {
        cpt++;
        if (
          ligne + 3 < puissance4.nbLigne &&
          colonne + 3 <= puissance4.nbColonne &&
          puissance4.plateau[ligne + 3][colonne + 3] === joueur
        ) {
          cpt++;
        }
      }
    }
    if (cpt > 3) return true;
  },
  coupPerdant: function (ligne, colonne, joueur) {
    if (ligne - 1 > 0) {
      if (this.verifGagner(ligne - 1, colonne, 1)) return true;
    }
  },
};
