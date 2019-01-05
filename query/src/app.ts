import createError from 'http-errors';
import express, { Request, Response, NextFunction} from 'express';
import logger from 'morgan';
import StorageService from './services/storageService';
import PetitionService from './services/petitionService';
import PetitionsRouter from './routes/petitions';

const storageService = new StorageService();
const petitionService = new PetitionService(storageService);

petitionService.initialize().catch((error) => {
  console.error(error.stack);
  process.exit(1);
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/petitions', PetitionsRouter(petitionService));

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  res.status(500)
    .type('json')
    .send();
});


module.exports = app;
