import express, { Request, Response, NextFunction } from 'express';
import JsonRpcService from '../services/jsonRpcService';

export const get = (jsonRpcService: JsonRpcService) => async (req: Request, res: Response, next: NextFunction) => {
  res.status(200)
    .json(jsonRpcService.network);
};

export default (jsonRpcService: JsonRpcService) => {
  const router = express.Router();

  router.get('/', get(jsonRpcService));

  return router;
};
