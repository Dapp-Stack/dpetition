import express, { Request, Response } from 'express';
import asyncMiddleware from '../middlewares/asyncMiddleware';
import PetitionService from '../services/petitionService';

export const list = (petitionService: PetitionService) => async (req: Request, res: Response) => {
  const petitions = await petitionService.all()
  res.status(200)
    .type('json')
    .send(JSON.stringify(petitions));
};

export const get = (petitionService: PetitionService) => async (req: Request, res: Response) => {
  const petition = await petitionService.findById(req.params.id)
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
