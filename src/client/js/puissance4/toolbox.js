var toolbox = {
  /**
   * permet d'initialiser un tableau de tableau en fonction du nombre de ligne et de colonne passé en paramètre
   * @param {Number} nbLigne
   * @param {Number} nbColonne
   * @param {*} car
   */
  initPlateau: function (nbLigne, nbColonne, car = "") {
    let plateau = [];
    for (let l = 0; l < nbLigne; l++) {
      let cellule = [];
      for (let c = 0; c < nbColonne; c++) {
        cellule.push(car);
      }
      plateau.push(cellule);
    }
    return plateau;
  },
};
