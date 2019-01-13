import express, { Request, Response, NextFunction } from 'express';
import asyncMiddleware from '../middlewares/asyncMiddleware';
import EnsService from '../services/ensService';

export const find = (ensService: EnsService) => async (req: Request, res: Response, next: NextFunction) => {
  const {ensName} = req.params;
  try {
    const address = await ensService.find(ensName);
    if(address) {
      res.status(200)
        .json({address});
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
};

export default (ensService: EnsService) => {
  const router = express.Router();

  router.get('/:ensName',
    asyncMiddleware(find(ensService)));

  return router;
};
