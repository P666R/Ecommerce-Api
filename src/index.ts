import express, { Express } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
import { rateLimit } from 'express-rate-limit';

const app: Express = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(express.json());

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
  log: ['query'],
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at port:${PORT}`);
});
