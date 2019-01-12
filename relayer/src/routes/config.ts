import express, { Request, Response, NextFunction } from 'express';
import asyncMiddleware from '../middlewares/asyncMiddleware';
import JsonRpcService from '..//services/jsonRpcService';

export const get = (jsonRpcService: JsonRpcService) => async (req: Request, res: Response, next: NextFunction) => {
  res.status(200)
    .type('json')
    .send(JSON.stringify({
      network: jsonRpcService.network,
      contracts: jsonRpcService.contracts,
    }));
};

export default (jsonRpcService: JsonRpcService) => {
  const router = express.Router();

  router.get('/',
    asyncMiddleware(get(jsonRpcService)));

  return router;
};
