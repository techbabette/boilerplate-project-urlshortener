require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const dns = require("dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let parser = bodyParser.urlencoded({extended: false});

app.use(parser);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let lastShortId = 1;
let urlMap = {};

app.get("/api/shorturl/:shorturl", function(req, res){
  let requestedShortURL = req.params.shorturl;
  res.redirect(urlMap[requestedShortURL]);
})

app.post('/api/shorturl', function(req, res){
  let requestBody = req.body;
  let requestedURL = new URL(requestBody.url);
  dns.lookup(requestedURL.hostname, function (error, address, family) {
    if (error) {
      res.json({error : "invalid url"});
      return;
    }
    
    urlMap[lastShortId] = requestedURL;
    let responseBody = {original_url : requestedURL, short_url : lastShortId};
    lastShortId++;
    res.json(responseBody)
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
