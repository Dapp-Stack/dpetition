import cors from 'cors';
import createError from 'http-errors';
import express, { Request, Response, NextFunction} from 'express';
import useragent from 'express-useragent';
import logger from 'morgan';

import JsonRpcService from './services/jsonRpcService';
import StorageService from './services/storageService';
import PetitionService from './services/petitionService';
import AuthorisationService from './services/authorisationService';
import IdentityService from './services/identityService';
import EnsService from './services/ensService';

const PetitionsRouter = require('./routes/petitions');
const RequestAuthorisationRouter = require('./routes/authorisation');
const IdentityRouter = require('./routes/identity');
const EnsRouter = require('./routes/ens');

const jsonRpcService = new JsonRpcService();
const storageService = new StorageService();
const authorisationService = new AuthorisationService();
const ensService = new EnsService(jsonRpcService);
const petitionService = new PetitionService(storageService, jsonRpcService);
const identityService = new IdentityService(jsonRpcService, ensService, authorisationService);

jsonRpcService.initialize().catch((error: Error) => {
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
app.use('/ens', EnsRouter(ensService));

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
