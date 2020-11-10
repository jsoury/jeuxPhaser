let joueurEnCours = 1;
let finJeu = false;
let pointJ1 = 0;
let pointJ2 = 0;
let IaOn = false;
let nomJoueur1 = "";
let nomJoueur2 = "";

const startIA = () => {
  IaOn = !IaOn;
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const CouleurJoueur = (joueurEnCours) => {
  if (joueurEnCours === 2) {
    $("#tour")
      .removeClass("bg-warning", "")
      .removeClass("d-none", "")
      .addClass("bg-danger")
      .html("tour de " + nomJoueur2);
  } else {
    $("#tour")
      .removeClass("bg-danger", "")
      .removeClass("d-none", "")
      .addClass("bg-warning")
      .html("tour de " + nomJoueur1);
  }
};

const initJeux = () => {
  joueurEnCours = 1;
  CouleurJoueur(joueurEnCours);
  $(".alert").addClass("d-none").removeClass("alert-warning alert-danger");
  $("#recommencer").remove();
  finJeu = false;
  let contentJ1 = "<img src='/puissance4/pionJaune.png' class='img-fluid'/>";
  let contentJ2 = "<img src='/puissance4/pionRouge.png' class='img-fluid'/>";
  contentJ1 += pointJ1;
  contentJ2 += pointJ2;
  $("#scoreJ1").html(contentJ1);
  $("#scoreJ2").html(contentJ2);
  puissance4.initPuissance4();
  puissance4.AfficherPlateau(joueurEnCours);
};

const jouer = (colonne) => {
  jouerCase(colonne);
  if (IaOn) {
    sleep(2000).then(() => {
      jouerCase(IA.choixColone());
    });
    //jouerCase(IA.choixColone());
  }
};
const jouerCase = (colonne) => {
  if (!finJeu) {
    let ligneVide = puissance4.retournerFirstLigneVideDeColonne(colonne);
    if (ligneVide !== -1) {
      puissance4.jouerCase(joueurEnCours, ligneVide, colonne);
      if (puissance4.verificationFinJeu(joueurEnCours)) {
        puissance4.AfficherPlateau(joueurEnCours);
        gererFinJeu(joueurEnCours);
      }
      if (joueurEnCours === 1) {
        joueurEnCours = 2;
      } else {
        joueurEnCours = 1;
      }
      CouleurJoueur(joueurEnCours);
      puissance4.AfficherPlateau(joueurEnCours);
      animer.animat(ligneVide, colonne);
    }
  }
};

const gererFinJeu = (joueurEnCours) => {
  finJeu = true;
  if (joueurEnCours === 1) {
    pointJ1++;
    $(".alert").removeClass("d-none").addClass("alert-warning");
  } else {
    pointJ2++;
    $(".alert").removeClass("d-none").addClass("alert-danger");
  }
  $(".alertContent").html(`Joueur ${joueurEnCours} à gagné`);
  $(
    '<button type="button" id="recommencer" class="btn btn-info btn-block" onClick="initJeux()">Recommencer</button>'
  ).insertAfter(".alert");
};

$("#launchGame").on("click", function () {
  if ($("#joueur1").val()) {
    nomJoueur1 = $("#joueur1").val();
  } else nomJoueur1 = "joueur 1";

  if ($("#joueur2").val() && !$("#IA")[0].checked) {
    nomJoueur2 = $("#joueur2").val();
  } else if ($("#IA")[0].checked) {
    nomJoueur2 = "Nono le robot";
  } else nomJoueur2 = "joueur 2";
  initJeux();
  //$("form")[0].reset();
});
