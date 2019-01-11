import cors from 'cors';
import createError from 'http-errors';
import express, { Request, Response, NextFunction} from 'express';
import useragent from 'express-useragent';
import logger from 'morgan';

import StorageService from './services/storageService';
import PetitionService from './services/petitionService';
import AuthorisationService from './services/authorisationService';
import IdentityService from './services/identityService';

const PetitionsRouter = require('./routes/petitions');
const RequestAuthorisationRouter = require('./routes/authorisation');
const IdentityRouter = require('./routes/identity');

const storageService = new StorageService();
const petitionService = new PetitionService(storageService);
const authorisationService = new AuthorisationService();
const identityService = new IdentityService();

petitionService.initialize().catch((error: Error) => {
  console.error(error.stack);
  process.exit(1);
});


const app = express();

app.use(logger('dev'));
app.use(cors);
app.use(useragent.express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/authorisation', RequestAuthorisationRouter(authorisationService));
app.use('/identity', IdentityRouter(identityService));
app.use('/petitions', PetitionsRouter(petitionService));

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  res.status(500)
    .type('json')
    .send();
});


module.exports = app;
