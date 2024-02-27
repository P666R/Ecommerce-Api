// Import the express library and the Express type from the 'express' package
import express, { Express } from 'express';
// Import the rateLimit function from the 'express-rate-limit' package
import { rateLimit } from 'express-rate-limit';
// Import the PrismaClient class from the '@prisma/client' package
import { PrismaClient } from '@prisma/client';
// Import the PORT constant from the 'secrets' file
import { PORT } from './secrets';
// Import the rootRouter from the 'routes' file
import rootRouter from './routes';
// Import the errorMiddleware function from the 'errors' middleware file
import { errorMiddleware } from './middlewares/errors';

// Create an express application
const app: Express = express();

// Create a rate limiter middleware with a window of 15 minutes and a maximum of 100 requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Use the rate limiter middleware
app.use(limiter);

// Parse incoming JSON data
app.use(express.json());

// Mount the rootRouter under the '/api' path
app.use('/api', rootRouter);

// Create a new instance of the PrismaClient with query logging
export const prismaClient = new PrismaClient({
  log: ['query'],
});

// Use the global error handling errorMiddleware
app.use(errorMiddleware);

// Start the server and listen on the specified PORT
app.listen(PORT, () => {
  console.log(`Server is running at port:${PORT}`);
});
