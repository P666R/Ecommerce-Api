import express, { Express } from 'express';
import { tokenBucketRatelimiter } from './util/tokenBucketRateLimiter';
import { rateLimit } from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { PORT } from './secrets';
import rootRouter from './routes';
import { errorMiddleware } from './middlewares/errors';

// Create an express application
const app: Express = express();

// Create a rate limiter middleware with a window of 15 minutes and a maximum of 100 requests
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Use the global rate limiter middleware
app.use(globalRateLimiter);

// Use the custom token bucket rate limiter middleware
// Works for logged in users based on the user's ID extracted from the JWT token
// Can be set to routes of choice as per the requirements
app.use(tokenBucketRatelimiter);

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
