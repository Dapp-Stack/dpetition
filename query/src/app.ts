import createError from 'http-errors';
import express, { Request, Response, NextFunction} from 'express';
import logger from 'morgan';
import PetitionService from './services/petitionService';

const PetitionRouter = require('./routes/petitions');
const petitionService = new PetitionService();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/:network/petitions', PetitionRouter(petitionService));

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});


module.exports = app;
