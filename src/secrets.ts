// Import the 'dotenv' package
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Assign the value of the environment variable 'PORT' to the constant 'PORT'
export const PORT = process.env.PORT;

// Assign the value of the environment variable 'JWT_SECRET' to the constant 'JWT_SECRET'
export const JWT_SECRET = process.env.JWT_SECRET!;
