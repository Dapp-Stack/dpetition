import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';

const RequestAuthorisationRouter = require('./routes/authorisation');
const IdentityRouter = require('./routes/identity');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/authorisation', RequestAuthorisationRouter(this.authorisationService));
app.use('/identity', IdentityRouter(this.identityService));

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  next(createError(500));
});

module.exports = app;
