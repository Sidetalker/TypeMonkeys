// Initialize
var express  = require('express');
var app      = express();                           // create our app w/ express
var mongoose = require('mongoose');                 // mongoose for mongodb
var morgan = require('morgan');                     // log requests to the console (express4)
var bodyParser = require('body-parser');            // pull information from HTML POST (express4)
var methodOverride = require('method-override');    // simulate DELETE and PUT (express4)

// Configure app
app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                             // log every request to the console

app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (handled by angular)
});

// Start listening
app.listen(8080);
console.log("App listening on port 8080");

// Monkey model
var Monkey = mongoose.model('Monkey', {
	WPM : 0
});