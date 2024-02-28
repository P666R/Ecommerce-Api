import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  listAddress,
  updateUser,
  listUsers,
  getUserById,
} from '../controllers/users';

const userRoutes: Router = Router();

// Use the authMiddleware for all routes defined below
userRoutes.use(authMiddleware);

// Set up the route for adding an address, using the addAddress function with error handling
userRoutes.post('/address', errorHandler(addAddress));

// Set up the route for deleting an address, using the deleteAddress function with error handling
userRoutes.delete('/address/:id', errorHandler(deleteAddress));

// Set up the route for getting a list of addresses, using the listAddress function with error handling
userRoutes.get('/address', errorHandler(listAddress));

// Set up the route for updating a user, using the updateUser function with error handling
userRoutes.put('/', errorHandler(updateUser));

// Use the adminMiddleware for all routes defined below
userRoutes.use(adminMiddleware);

// Set up the route for changing a user's role, using the changeUserRole function with error handling
userRoutes.put('/:id/role', errorHandler(changeUserRole));

// Set up the route for getting a list of users, using the listUsers function with error handling
userRoutes.get('/', errorHandler(listUsers));

// Set up the route for getting a specific user by ID, using the getUserById function with error handling
userRoutes.get('/:id', errorHandler(getUserById));

// Export the userRoutes for use in other files
export default userRoutes;
