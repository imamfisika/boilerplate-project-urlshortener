require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns')


// Basic Configuration
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');

const configBodyParser = bodyParser.urlencoded({ extended: false })

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
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

  //dns.lookup(input.url, (err, address, family) => {
  if (isValidUrl(input.url)) {
    if (!dbUrl.includes(input.url))
      dbUrl.push(input.url)
    const db = {
      original_url: input.url,
      short_url: dbUrl.indexOf(input.url) + 1
    }

    console.log(dbUrl)

    res.json(db)
  }
  res.json({ error: "Invalid URL" })


  // }

  //  )


})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
