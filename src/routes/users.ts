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

userRoutes.use(authMiddleware);

userRoutes.post('/address', errorHandler(addAddress));

userRoutes.delete('/address/:id', errorHandler(deleteAddress));

userRoutes.get('/address', errorHandler(listAddress));

userRoutes.put('/', errorHandler(updateUser));

userRoutes.use(adminMiddleware);

userRoutes.put('/:id/role', errorHandler(changeUserRole));

userRoutes.get('/', errorHandler(listUsers));

userRoutes.get('/:id', errorHandler(getUserById));

export default userRoutes;
