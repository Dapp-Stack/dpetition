import express, { Request, Response } from 'express';
import asyncMiddleware from '../middlewares/asyncMiddleware';
import PetitionService from '../services/petitionService';

export const list = (petitionService: PetitionService) => async (req: Request, res: Response) => {
  const petitions = PetitionService.byNetwork(req.params.network)
  res.status(200)
    .type('json')
    .send(JSON.stringify(petitions));
};

export const get = (petitionService: PetitionService) => async (req: Request, res: Response) => {
  const petition = PetitionService.findByNetworkAndId(req.params.network, req.params.id)
  res.status(200)
    .type('json')
    .send(JSON.stringify(petition));
};

export default (petitionService: PetitionService) => {
  const router = express.Router();

  router.get('/', asyncMiddleware(list(petitionService)));

  router.get('/:id', asyncMiddleware(get(petitionService)));

  return router;
};
