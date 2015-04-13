// Initialize
var express  = require('express');
var app      = express();                           // create our app w/ express
var morgan = require('morgan');                     // log requests to the console (express4)
var mongoose = require('mongoose');                 // mongoose for mongodb
var bodyParser = require('body-parser');            // pull information from HTML POST (express4)
var methodOverride = require('method-override');    // simulate DELETE and PUT (express4)

// Configure app
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                             // log every request to the console

app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); 			// load the single view file (handled by angular)
});

// Test autodeploy
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});