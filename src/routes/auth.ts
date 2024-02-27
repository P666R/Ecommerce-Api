// Import the Router from the 'express' package
import { Router } from 'express';

// Import the login, signup, and me functions from the '../controllers/auth' file
import { login, signup, me } from '../controllers/auth';

// Import the errorHandler function from the '../error-handler' file
import { errorHandler } from '../error-handler';

// Import the authMiddleware function from the '../middlewares/auth' file
import authMiddleware from '../middlewares/auth';

// Create a new Router instance and assign it to the authRoutes variable
const authRoutes: Router = Router();

// Define a POST route '/signup' that uses the errorHandler function with the signup function
authRoutes.post('/signup', errorHandler(signup));

// Define a POST route '/login' that uses the errorHandler function with the login function
authRoutes.post('/login', errorHandler(login));

// Define a GET route '/me' that uses the authMiddleware function and the errorHandler function with the me function
authRoutes.get('/me', [authMiddleware], errorHandler(me));

// Export the authRoutes Router instance
export default authRoutes;
