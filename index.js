require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns')


// Basic Configuration
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');

const configBodyParser = bodyParser.urlencoded({ extended: false })

function isUrlValid(userInput) {
  var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res == null)
    return false;
  else
    return true;
}

let dbUrl = [];

app.use(configBodyParser)


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:url', function (req, res) {
  const index = req.params.url - 1;
  console.log(index)
  const url = dbUrl[index];
  console.log(dbUrl)
  console.log(url)
  res.redirect(url)
});

app.post('/api/shorturl', function (req, res) {
  const input = req.body

  console.log(input.url)

  const removeHttp = input.url.replace(/https:\/\/|http:\/\//gi, '');

  console.log(removeHttp)

  // dns.lookup(input.url, (err, address, family) => {
  if (isUrlValid(input.url)) {
    if (!dbUrl.includes(input.url))
      dbUrl.push(input.url)
    const db = {
      original_url: input.url,
      short_url: dbUrl.indexOf(input.url) + 1
    }

    console.log(dbUrl)

    res.json(db)
  }
  else {
    res.json({ error: "invalid url" })
  }


  // }

  //)


});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
