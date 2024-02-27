import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import {
  createOrder,
  listOrders,
  cancelOrder,
  getOrderById,
  listAllOrders,
  listUserOrders,
  changeStatus,
} from '../controllers/orders';
import adminMiddleware from '../middlewares/admin';

const orderRoutes: Router = Router();

// Use the authMiddleware for all routes defined below
orderRoutes.use(authMiddleware);

// Set up the route for creating an order
orderRoutes.post('/', errorHandler(createOrder));

// Set up the route for getting a list of orders
orderRoutes.get('/', errorHandler(listOrders));

// Set up the route for canceling an order
orderRoutes.put('/:id/cancel', errorHandler(cancelOrder));

// Set up the route for getting a list of all orders
orderRoutes.get('/index', [adminMiddleware], errorHandler(listAllOrders));

// Set up the route for getting a list of orders by user
orderRoutes.get('/users/:id', [adminMiddleware], errorHandler(listUserOrders));

// Set up the route for changing the status of an order
orderRoutes.put('/:id/status', [adminMiddleware], errorHandler(changeStatus));

// Set up the route for getting an order by ID
orderRoutes.get('/:id', errorHandler(getOrderById));

export default orderRoutes;
