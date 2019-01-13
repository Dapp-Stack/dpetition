import express, { Request, Response } from 'express';
import geoip from 'geoip-lite';
import moment from 'moment';
import asyncMiddleware from '../middlewares/asyncMiddleware';
import AuthorisationService from '../services/authorisationService';
import { RequestAuthorisation } from "../types";

export const createRequest = (authorisationService: AuthorisationService) => async (req: Request, res: Response) => {
  if (!req.useragent) {
    return res.status(422)
      .type('json')
      .send();
  }

  let ipAddress = req.headers['x-forwarded-for'] || req.ip;
  ipAddress = Array.isArray(ipAddress) ? ipAddress[0] : ipAddress;
  const city = geoip.lookup(ipAddress) ? geoip.lookup(ipAddress).city : 'unknown';

  const requestAuthorisation: RequestAuthorisation = {
    deviceInfo: {
      ipAddress,
      city,
      name: req.useragent.platform,
      os: req.useragent.os,
      browser: req.useragent.browser,
      time: moment().format('h:mm'),
    },
    key: req.body.key.toLowerCase(),
    identityAddress: req.body.identityAddress
  };
  await authorisationService.addRequest(requestAuthorisation);
  res.status(201).end();
};

export const getPending = (authorisationService: AuthorisationService) => async (req: Request, res: Response) => {
  const {identityAddress} = req.params;
  const response = await authorisationService.getPendingAuthorisations(identityAddress);
  res.status(200).json({ response });
};

export const denyRequest = (authorisationService: AuthorisationService) => async (req: Request, res: Response) => {
  const { identityAddress } = req.params;
  const { key } = req.body;
  await authorisationService.removeRequest(identityAddress, key);
  res.status(204).end();
};

export default (authorisationService: AuthorisationService) => {
  const router = express.Router();

  router.post('/', asyncMiddleware(createRequest(authorisationService)));

  router.get('/:identityAddress', asyncMiddleware(getPending(authorisationService)));

  router.delete('/:identityAddress', asyncMiddleware(denyRequest(authorisationService)));

  return router;
};
