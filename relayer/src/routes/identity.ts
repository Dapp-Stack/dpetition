import express, { Request, Response, NextFunction } from 'express';
import asyncMiddleware from '../middlewares/asyncMiddleware';
import IdentityService from '../services/identityService';

export const create = (identityService: IdentityService) => async (req: Request, res: Response, next: NextFunction) => {
  const {managementKey, ensName} = req.body;
  try {
    const transaction = await identityService.create(managementKey, ensName);
    res.status(201)
      .type('json')
      .send(JSON.stringify({transaction}));
  } catch (err) {
    next(err);
  }
};

export const execution = (identityService: IdentityService) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await identityService.executeSigned(req.body);
    res.status(201)
      .type('json')
      .send(JSON.stringify({transaction}));
  } catch (err) {
    next(err);
  }
};

export default (identityService: IdentityService) => {
  const router = express.Router();

  router.post('/',
    asyncMiddleware(create(identityService)));

  router.post('/execution',
    asyncMiddleware(execution(identityService)));

  return router;
};
