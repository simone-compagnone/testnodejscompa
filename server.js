var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');

var app = express();

global.properties = require('./config/properties'); 

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

/*
  HELMET default settings:
  - dnsPrefetchControl controls browser DNS prefetching
  - frameguard to prevent clickjacking 
  - hidePoweredBy to remove the X-Powered-By header
  - hsts for HTTP Strict Transport Security 
  - ieNoOpen sets X-Download-Options for IE8+
  - noSniff to keep clients from sniffing the MIME type
  - xssFilter adds some small XSS protections
 */

app.disable('x-powered-by');
app.use(helmet());

//placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//serve static files (html,css,ecc..) in /public folder
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
app.all(global.properties.baseUrl() + '/*', [require('./middlewares/validateRequest')]);

app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Start the server
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

