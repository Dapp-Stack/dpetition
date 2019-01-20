import cors from 'cors';
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import useragent from 'express-useragent';
import logger from 'morgan';

import JsonRpcService from './services/jsonRpcService';
import AuthorisationService from './services/authorisationService';
import IdentityService from './services/identityService';
import EnsService from './services/ensService';

import RequestAuthorisationRouter from './routes/authorisation';
import IdentityRouter from './routes/identity';
import ConfigRouter from './routes/config';

async function initApp() {
  const jsonRpcService = new JsonRpcService();

  try {
    await jsonRpcService.initialize()
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }

  const authorisationService = new AuthorisationService();
  const ensService = new EnsService(jsonRpcService);
  const identityService = new IdentityService(jsonRpcService, ensService, authorisationService);

  const app = express();

  app.use(logger('dev'));
  app.use(cors());
  app.use(useragent.express());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/authorisation', RequestAuthorisationRouter(authorisationService));
  app.use('/identity', IdentityRouter(identityService));
  app.use('/config', ConfigRouter(jsonRpcService));

  app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
  });

  app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500).json({message: err.message});
  });

  return app
}

module.exports = initApp;
