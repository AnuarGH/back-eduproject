/* Packages */
const errors = require("./utils/errors");
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Don't forget to delete if not needed
const logger = require('morgan');
const express = require('express');


/* Imports */
let routes = {
    index: require('./routes/index'),
    api: require('./routes/api'),
    auth: require('./routes/auth'),
    admin: require('./routes/admin'),
    upload: require('./routes/upload')
};

/* Create app */
let app = express();

/* View engine */
app.set('view engine', 'html');
app.engine('html', function (path, options, callback) {
    fs.readFile(path, 'utf-8', callback);
});

/* Middleware */
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

/* Routes */
app.use(['/admin/*', '/admin'], routes.admin);
app.use('/auth', routes.auth);
app.use('/api' , routes.api);
app.use('/upload', routes.upload);
app.use('/*', routes.index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(errors.notFound);
});

/* Error handler */
// noinspection JSUnusedLocalSymbols
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({
        "error": err.message || "Internal error",
        "status": err.status || 500
    });
});
module.exports = app;