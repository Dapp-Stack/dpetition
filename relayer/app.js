const createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var RequestAuthorisationRouter = require('./routes/authorisation');
var IdentityRouter = require('./routes/identity');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/authorisation', RequestAuthorisationRouter(this.authorisationService));
app.use('/identity', IdentityRouter(this.identityService));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  next(createError(500));
});

module.exports = app;
