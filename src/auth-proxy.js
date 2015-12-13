const express = require('express'),
  bodyParser = require('body-parser'),
  oauthserver = require('node-oauth2-server'),
  http = require('http');

const model = require('./auth-model');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.oauth = oauthserver({
  model, // See below for specification
  grants: ['password'],
  debug: true
});

app.all('/oauth/token', app.oauth.grant());

app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area');
});

app.use(app.oauth.errorHandler());

// Express App doesn't have a `close()` method
// but it can act as a request handler for Node http server
module.exports = http.createServer(app);
