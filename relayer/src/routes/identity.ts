import express, { Request, Response, NextFunction } from 'express';
import asyncMiddleware from '../middlewares/asyncMiddleware';
import IdentityService from '../services/identityService';

export const create = (identityService: IdentityService) => async (req: Request, res: Response, next: NextFunction) => {
  const {address, ensName} = req.body;
  try {
    const transaction = await identityService.create(address, ensName);
    res.status(201)
      .json(transaction);
  } catch (err) {
    next(err);
  }
};

export const execution = (identityService: IdentityService) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.dir(req.body)
    const transaction = await identityService.executeSigned(req.body);
    res.status(201)
      .json(transaction);
  } catch (err) {
    console.dir(err)
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
