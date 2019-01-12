import express, { Request, Response, NextFunction } from 'express';
import asyncMiddleware from '../middlewares/asyncMiddleware';
import EnsService from '../services/EnsService';

export const find = (ensService: EnsService) => async (req: Request, res: Response, next: NextFunction) => {
  const {ensName} = req.params;
  try {
    const address = await ensService.find(ensName);
    if(address) {
      res.status(200)
        .type('json')
        .send(JSON.stringify({address}));
    } else {
      res.status(404)
        .type('json')
        .send();
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
