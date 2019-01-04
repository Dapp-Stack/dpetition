import express, { Request, Response } from 'express';
import geoip from 'geoip-lite';
import moment from 'moment';
import asyncMiddleware from '../middlewares/asyncMiddleware';
import AuthorisationService from '../services/authorisationService';

export const request = (authorisationService: AuthorisationService) => async (req: Request, res: Response) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.ip;
  const deviceInfo = {
    ipAddress,
    name: req.useragent.platform,
    city: geoip.lookup(ipAddress) ? geoip.lookup(ipAddress).city : 'unknown',
    os: req.useragent.os,
    browser: req.useragent.browser,
    time: moment().format('h:mm')
  };
  const requestAuthorisation = {...req.body, deviceInfo};
  await authorisationService.addRequest(requestAuthorisation);
  res.status(201)
    .type('json')
    .send();
};

export const getPending = (authorisationService: AuthorisationService) => async (req: Request, res: Response) => {
  const {identityAddress} = req.params;
  const response = await authorisationService.getPendingAuthorisations(identityAddress);
  res.status(200)
    .type('json')
    .send(JSON.stringify({response}));
};

export const denyRequest = (authorisationService: AuthorisationService) => async (req: Request, res: Response) => {
  const {identityAddress} = req.params;
  const {key} = req.body;
  const response = await authorisationService.removeRequest(identityAddress, key);
  res.status(201)
    .type('json')
    .send(JSON.stringify({response}));
};

export default (authorisationService: AuthorisationService) => {
  const router = express.Router();

  router.post('/', asyncMiddleware(request(authorisationService)));

  router.get('/:identityAddress', asyncMiddleware(getPending(authorisationService)));

  router.post('/:identityAddress', asyncMiddleware(denyRequest(authorisationService)));

  return router;
};
