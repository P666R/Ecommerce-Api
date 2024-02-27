import { Router } from 'express';
import { errorHandler } from '../error-handler';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../controllers/products';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';

const productsRoutes: Router = Router();

// Set up the route for getting a list of products (publicly accessible route)
productsRoutes.get('/', errorHandler(listProducts));

// Set up the route for getting a specific product (publicly accessible route)
productsRoutes.get('/:id', errorHandler(getProductById));

// Use the authMiddleware and adminMiddleware for all routes defined below
productsRoutes.use(authMiddleware, adminMiddleware);

// Set up the route for creating a product
productsRoutes.post('/', errorHandler(createProduct));

// Set up the route for updating a product
productsRoutes.put('/:id', errorHandler(updateProduct));

// Set up the route for deleting a product
productsRoutes.delete('/:id', errorHandler(deleteProduct));

export default productsRoutes;
