import { createClient } from 'redis';

// Function to connect to Redis
export async function connectToRedis() {
  try {
    const client = createClient();
    await client.connect();
    return client;
  } catch (error) {
    console.log(error);
  }
}
