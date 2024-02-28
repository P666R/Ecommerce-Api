import { NextFunction, Request, Response } from 'express';
import { connectToRedis } from './redisOp';
import { extractUserIdFromToken } from './jwtOp';

const TIME_WINDOW_SECONDS = 60; // 1 minute as an example for testing
const MAX_ATTEMPTS = 2; // maximum allowed attempts within the time window for testing

// Function for token bucket rate limiting
export const tokenBucketRatelimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const client = await connectToRedis();

    const token = req.headers.authorization;

    if (!token) {
      return next();
    }

    // Extract user id from token
    const userId = await extractUserIdFromToken(token);

    const keyAttempts = `attempts:${userId}`;
    const keyLastRequest = `lastRequest:${userId}`;

    const attempts: number = parseInt(
      (await client?.get(keyAttempts)) || '1',
      10
    );
    const lastRequest: number = parseInt(
      (await client?.get(keyLastRequest)) || '1',
      10
    );

    const currentTime = Math.floor(Date.now() / 1000);

    if (
      attempts >= MAX_ATTEMPTS &&
      currentTime - lastRequest < TIME_WINDOW_SECONDS
    ) {
      // User has exceeded rate limit
      return res.status(429).json({
        error: 'Rate limit exceeded for user. Try again later!',
        retryAfter: TIME_WINDOW_SECONDS - (currentTime - lastRequest),
      });
    }

    // Update last request timestamp and attempt count
    await client?.set(keyLastRequest, currentTime.toString());
    await client?.set(keyAttempts, (attempts + 1).toString());

    // Reset attempts if the time window has passed
    if (currentTime - lastRequest >= TIME_WINDOW_SECONDS) {
      await client?.set(keyAttempts, '1');
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
