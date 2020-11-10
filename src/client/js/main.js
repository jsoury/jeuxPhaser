const afficherCard = (jeuJSON) => {
  var jeux = jeuJSON;
  var txt = "";
  for (let jeu in jeux) {
    txt += `<div class="col mb-4">    
    <div class="card" style="width: 18rem; min-height:320px;">
    <a href="${jeux[jeu].link}">
    <img src="${jeux[jeu].image}" class="card-img-top img-fluid" alt="${jeux[jeu].nom}"/>
    </a>        
        <div class="card-body">
            <h5 class="card-title">${jeux[jeu].nom}</h5>
            <p class="card-text">${jeux[jeu].description}</p>            
        </div>
        
    </div>    
</div>
`;
  }
  return $(txt).appendTo(".content");
};

var requestURL = "/jeu";
var request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.send();
request.onload = function () {
  var jeux = request.response;
  afficherCard(jeux);
};
