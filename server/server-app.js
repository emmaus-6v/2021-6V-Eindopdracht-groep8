/**********************************************/
/* -------- Algemeen server gedeelte -------- */
/**********************************************/
const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// hier zijn de statische bestanden (html, css, ...) te vinden:
app.use(express.static(path.join(__dirname, '/public')));


// bepaal wat er moet gebeuren bij verzoeken op verschillende paden / routes van je URL:
// ⬇︎ HIER JE EIGEN AANPASSINGEN MAKEN ⬇︎
app.get('/', (_request, response) => {response.redirect('index.html'); })
app.get('/api/checkchanges/:widgetTimeStamp', checkChanges);
app.get('/api/addButtonPress', addButtonPress);
app.get('/api/getTotalPresses', getTotalPresses);
app.get('/api/setKnikkerbaanStatus/:newStatus', setKnikkerbaanStatus);


// start de server en geef een berichtje in de console dat het gelukt is!
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})




/**********************************************/
/* ----------- Database gedeelte ------------ */
/**********************************************/
const Pool = require('pg').Pool

// gegevens en functies om in te loggen in de database
let connectionString = {
  user: 'api',
  database: 'knikkerbaan',
  password: 'apipass',
  host: 'localhost',
  port: 5432,
  ssl: false
};

if(process.env.GITPOD_WORKSPACE_ID === undefined) {
  connectionString = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
  };
} 

const pool = new Pool(connectionString);
pool.on('connect', () => console.log('connected to db'));



// Functies die bewerkingen op de database uitvoeren:
// ⬇︎ HIER JE EIGEN AANPASSINGEN MAKEN ⬇︎


/**
 * checkChanges
 * 
 * checkt of er sinds de in het request meegegeven timestamp
 * wijzigingen zijn gedaan in de database en geeft dit terug
 * @param _request het webrequest dat deze bewerking startte
 * @param response het antwoord dat teruggegeven gaat worden.
 */
function checkChanges(_request, response) {
  var lastWidgetChange = new Date();
  lastWidgetChange.setTime(_request.params.widgetTimeStamp);
  pool.query(`SELECT *
                FROM (SELECT tijd FROM buttonPresses) AS alleTijden
                WHERE tijd > $1`,
                [lastWidgetChange], (error, results) => {
                  if (error) {
                    throw error;
                  }

                  if (results.rowCount > 0) {
                    response.status(200).send("Update needed");
                  }
                  else {
                    response.status(200).send("No update needed");
                  }
                  
                });
}


/**
 * addButtonPress
 * 
 * voegt een nieuwe row toe aan tabel "buttonPresses"
 * en geeft de id van de nieuwe regel terug in de reponse
 * @param _request het webrequest dat deze bewerking startte
 * @param response het antwoord dat teruggegeven gaat worden.
 */
function addButtonPress(_request, response) {
  pool.query("INSERT INTO buttonPresses (tijd) VALUES (CURRENT_TIMESTAMP) RETURNING ID", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`ButtonPress added with ID: ${results.rows[0].id}`);
  });
}


/**
 * getTotalPresses
 * 
 * geeft de waarde van "ButtonPresses" uit de tabel algemeen terug in de respons
 * @param _request het webrequest dat deze bewerking startte
 * @param response het antwoord dat teruggegeven gaat worden.
 */
function getTotalPresses(_request, response){
  pool.query("SELECT COUNT(*) AS totalButtonPresses, MAX(tijd) as lastTimeStamp  FROM buttonPresses;", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows[0]);
  });
}


/**
 * setKnikkerbaanStatus
 * 
 * verandert de status in de waarde zoals meegegeven in het request
 * @param _request het webrequest dat deze bewerking startte
 * @param response het antwoord dat teruggegeven gaat worden.
 */
function setKnikkerbaanStatus(_request, response) {
  const newStatus = parseInt(_request.params.newStatus);
  pool.query("INSERT INTO baanStatus (status, tijd, opmerking) VALUES ($1, CURRENT_TIMESTAMP, $2)", [newStatus, comment], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send("Status has been modified");
  });
}