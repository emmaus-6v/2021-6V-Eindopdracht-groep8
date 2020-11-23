const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const process = require('process'); 
const fs = require('fs');
const port = 3001;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static('./srv/data'))
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
  fs.writeFile('./srv/pid', process.pid, function (err) {
  if (err) return console.log(err);
  });
})


