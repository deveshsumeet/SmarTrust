var express = require('express');
var https = require('https');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multer = require('multer');

var routes = require('./routes/index');
var users = require('./routes/users');

var restaurants = require('./routes/restaurants');
var transactions = require('./routes/transactions');
var blockchain = require('./routes/blockchain');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/review_details');

var app = express();

var done = false;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/hackathon', express.static(__dirname + '/hackathon'));
app.use('/tiecon', express.static(__dirname + '/tiecon'));
app.use('/bower_components', express.static(__dirname + '/bower_components/'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.use(multer({
    dest: './uploads/',
    rename: function (fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.name + ' uploaded to  ' + file.path)
        done = true;
    }

}));


app.get('/restaurants', restaurants.index);
app.post('/restaurants', restaurants.create);

app.get('/transactions', transactions.index);
app.post('/transactions', transactions.create);


app.get('/reviews', blockchain.index);
app.post('/reviews', blockchain.create);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
