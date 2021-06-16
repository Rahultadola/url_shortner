var express = require('express');
var bodyParser = require('body-parser');

const dns = require('dns');

var app = express();

app.use( '/public', express.static( __dirname + '/public' ) );

app.use(bodyParser.urlencoded({extended: false}));


var shortURLStorage = [];

app.get('/', (req, res) => {
  res.sendFile( __dirname + '/views/index.html');
});

app.route('/api/shorturl')  
  .post((req, res) => {
    const lURL = req.body.url;
    const regExEmail = /^https?:\/\/(www\.)?\w+(\..+)+\//g;

    const matchList = lURL.match(regExEmail);
    
    if(matchList === null){
      res.json({ error: "invalid url"});
    } else {
      const sURL = shortURLStorage.length + 1;   
      shortURLStorage.push({ original_url: lURL, short_url: sURL });

      res.json({ original_url: lURL, short_url: sURL });
    }   
  });

app.get('/api/shorturl/:sURL', (req, res) => {    
    const urlObject = shortURLStorage.filter((a, b, c) => a.short_url === parseInt(req.params.sURL));
    if(urlObject.length === 0){
      res.json({error: "No short URL exist for given input"});
    } else {
      res.redirect(urlObject[0].original_url);
    }   
  }
);













 module.exports = app;
