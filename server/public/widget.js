var achtergrondPlaatje;
var laatsteUpdateTimeStamp;
var button;
var numberOfButtonPresses = 0;

/**
 * preload
 * deze functie wordt als eerste javascriptfunctie uitgevoerd,
 * dus zelfs nog vóór setup() !
 * Gebruik deze functie om plaatjes van de server te laten laden
 * door de browser die je widget opent
 */
function preload() {
  achtergrondPlaatje = loadImage('images/voorbeeld.jpg');
}


/**
 * checkForDatabaseUpdate
 * Controleert of de database wijzingen heeft waarvan wij nog niet weten.
 * Verdere actie vereist bij reponse "Update needed"
 */
function checkForDatabaseChanges() {
  // zet het serverrequest in elkaar
  var request = new XMLHttpRequest();
  request.open('GET', `/api/checkchanges/${laatsteUpdateTimeStamp}`, true)
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      if (this.response == "Update needed") {
        console.log("Server geeft aan dat de database een update heeft die widget nog niet heeft");

        // roep ander update functie(s) aan:
        getTotalPresses();
      }
      else {
        // je kunt de code hieronder aanzetten, maar krijgt dan wel iedere seconde een melding
        // console.log("Widget is up to date");
      }
    }
    else {
        console.log("bleh, server reageert niet zoals gehoopt");
        console.log(this.response);
      }
  }

  // verstuur het request
  request.send()
}

/**
 * getTotalPresses
 * Vraagt het totaal aantal buttonPresses op
 */
function getTotalPresses() {
  // zet het serverrequest in elkaar
  var request = new XMLHttpRequest()
  request.open('GET', '/api/getTotalPresses', true)
  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      console.log(`Totaal aantal buttonPresses = ${data.totalbuttonpresses} `);
      numberOfButtonPresses = data.totalbuttonpresses;
      var newTimeStamp = new Date(data.lasttimestamp).getTime()+1;

      // update indien nodig de timestamp
      if (laatsteUpdateTimeStamp < newTimeStamp) {
        laatsteUpdateTimeStamp = newTimeStamp;
      }
      
    }
    else {
        console.log("bleh, server reageert niet zoals gehoopt");
        console.log(this.response);
      }
  }

  // verstuur het request
  request.send()
}


function buttonPressed() {
  // zet het serverrequest in elkaar
  var request = new XMLHttpRequest()
  request.open('GET', '/api/addButtonPress', true)
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      console.log('ButtonPress doorgegeven aan server');
    }
    else {
        console.log("bleh, server reageert niet zoals gehoopt");
        console.log(this.response);
      }
  }

  // verstuur het request
  request.send()
}


/**
 * setup
 * de code in deze functie wordt eenmaal uitgevoerd,
 * als p5js wordt gestart
 */
function setup() {
  // Maak het canvas van je widget
  createCanvas(480, 200);

  button = createButton('Klik op deze knop!');
  button.position(120, 15);
  button.mouseClicked(buttonPressed);


  // zet timeStamp op lang geleden zodat we alle recente info binnenkrijgen
  laatsteUpdateTimeStamp = new Date().setTime(0);

  // we vragen elke seconde of er iets is veranderd
  setInterval(checkForDatabaseChanges, 1000);
}


/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
  // schrijf hieronder de code van je widget
  // nu wordt slechts een voorbeeld als plaatje getoond
  // verwijder deze achtergrond en creëer je eigen widget

  image(achtergrondPlaatje, 0, 0, 480, 200);
  fill(255, 255, 255);
  text("Aantal keer geklikt:" + numberOfButtonPresses, 250, 30);
}