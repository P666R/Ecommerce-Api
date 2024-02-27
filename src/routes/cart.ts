import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import {
  addItemToCart,
  getCart,
  deleteItemFromCart,
  changeQuantity,
} from '../controllers/cart';

const cartRoutes: Router = Router();

// Use the authMiddleware for all routes defined below
cartRoutes.use(authMiddleware);

// Set up the route for adding an item to the cart
cartRoutes.post('/', errorHandler(addItemToCart));

// Set up the route for getting the cart
cartRoutes.get('/', errorHandler(getCart));

// Set up the route for deleting an item from the cart
cartRoutes.delete('/:id', errorHandler(deleteItemFromCart));

// Set up the route for changing the quantity of an item in the cart
cartRoutes.put('/:id', errorHandler(changeQuantity));

export default cartRoutes;
