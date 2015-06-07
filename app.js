'use strict';

var express = require('express');
var path = require('path');
var gaikan = require('gaikan');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// Configure gaikan to use the layout.
gaikan.options.layout = './views/layout.gaikan';
app.engine('gaikan', gaikan);
app.set('view engine', '.gaikan');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/assets/_dist/img/icon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/', routes);
app.use('/users', users);

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
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
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
