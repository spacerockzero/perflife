'use strict';

var express = require('express');
var path = require('path');

// rendering engine
var gaikan = require('gaikan');
var ECT = require('ect');
var ejsEngine = require('ejs-locals');


// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// routes
var routes = require('./routes/index');
var users = require('./routes/users');
var complex = require('./routes/complex');
var api = require('./routes/api');

var app = express();


// TODO: change this to detect node env
var isProduction = false;

// test different view engines:
switch (process.env.TEMPLATE) {
  case 'JADE':
    // jade view engine setup
    app.set('view options', { pretty: true }); //none of the other engines minify. this will keep the output equal
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    break;

  case 'GAIKAN':
    // Configure gaikan to use the layout.
    // NOTE: includes currently broken, can't solve with docs
    gaikan.options.directories = ['views', '.'];
    gaikan.options.enableCache = isProduction;
    gaikan.options.enableCompression = isProduction;
    gaikan.options.extensions = ['gaikan', 'html'];
    gaikan.options.layout = 'views/layouts/layout.gaikan';
    app.engine('gaikan', gaikan);
    app.set('view engine', '.gaikan');
    break;

  case 'ECT':
    // configure ECT as the templating engine
    var ectRenderer = new ECT({ watch: true, root: path.join(__dirname, '/views'), ext: '.ect' });
    app.set('view engine', 'ect');
    app.engine('ect', ectRenderer.render);
    break;

  case 'EJS':
    // ejs view engine setup
    // use ejs-locals for all ejs templates:
    app.engine('ejs', ejsEngine);
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs'); // so you can render('index')
    break;

  default:
    // ejs view engine setup
    // use ejs-locals for all ejs templates:
    app.engine('ejs', ejsEngine);
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs'); // so you can render('index')
}


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, '/assets/_dist/img/icon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/', routes);
app.use('/users', users);
app.use('/complex', complex);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// // Register the index handler.
// app.get('/', function (req, res) {
// 	// Render the template.
// 	res.render('index');
// });
//
// // Register the about handler.
// app.get('/about', function (req, res) {
// 	// Render the template.
// 	res.render('about', {author: 'Roel van Uden'});
// });


module.exports = app;
