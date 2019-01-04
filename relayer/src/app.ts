import createError from 'http-errors';
import express, { Request, Response, NextFunction} from 'express';
import useragent from 'express-useragent';
import logger from 'morgan';

const RequestAuthorisationRouter = require('./routes/authorisation');
const IdentityRouter = require('./routes/identity');

const app = express();

app.use(logger('dev'));
app.use(useragent.express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/authorisation', RequestAuthorisationRouter(authorisationService));
app.use('/identity', IdentityRouter(identityService));

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});


module.exports = app;
