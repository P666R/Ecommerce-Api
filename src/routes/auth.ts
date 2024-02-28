import { Router } from 'express';
import { login, signup, me } from '../controllers/auth';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';

const authRoutes: Router = Router();

// Define a POST route '/signup' that uses the errorHandler function with the signup function
authRoutes.post('/signup', errorHandler(signup));

// Define a POST route '/login' that uses the errorHandler function with the login function
authRoutes.post('/login', errorHandler(login));

// Define a GET route '/me' that uses the authMiddleware function and the errorHandler function with the me function
authRoutes.get('/me', [authMiddleware], errorHandler(me));

// Export the authRoutes Router instance
export default authRoutes;
