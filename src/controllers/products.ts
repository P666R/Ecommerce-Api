import { Request, Response } from 'express';
import { prismaClient } from '..';
import { CreateProductSchema } from '../schema/products';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

// Controller to create a new product
export const createProduct = async (req: Request, res: Response) => {
  CreateProductSchema.parse(req.body);

  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(','),
    },
  });

  for (const tag of req.body.tags) {
    await prismaClient.category.upsert({
      where: {
        name: tag,
      },
      create: {
        name: tag,
        products: {
          connect: {
            id: product.id,
          },
        },
      },
      update: {
        products: {
          connect: {
            id: product.id,
          },
        },
      },
    });
  }

  res.json(product);
};

// Controller to update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  const updatedProductData = req.body;

  if (updatedProductData.tags) {
    updatedProductData.tags = updatedProductData.tags.join(',');
  }

  // Get the existing product and its categories
  const existingProduct = await prismaClient.product.findFirst({
    where: {
      id: +req.params.id,
    },
    include: {
      categories: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!existingProduct) {
    throw new NotFoundException(
      'Product not found!',
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  // Extract existing category names from the fetched product
  const existingCategoryNames = existingProduct.categories.map(
    (category) => category.name
  );

  // Extract updated category names from the request body
  const updatedCategoryNames: string[] = updatedProductData.tags
    ? updatedProductData.tags.split(',')
    : [];

  // Identify new categories to add
  const newCategoryNames = updatedCategoryNames.filter(
    (category: string) => !existingCategoryNames.includes(category)
  );

  // Identify existing categories to remove
  const categoriesToRemove = existingCategoryNames.filter(
    (category) => !updatedCategoryNames.includes(category)
  );

  // Update the product data in the database
  const updatedProduct = await prismaClient.product.update({
    where: {
      id: +req.params.id,
    },
    data: {
      ...updatedProductData,
    },
  });

  // Add new categories
  for (const newCategoryName of newCategoryNames) {
    await prismaClient.category.upsert({
      where: {
        name: newCategoryName,
      },
      create: {
        name: newCategoryName,
        products: {
          connect: {
            id: updatedProduct.id,
          },
        },
      },
      update: {
        products: {
          connect: {
            id: updatedProduct.id,
          },
        },
      },
    });
  }

  // Remove existing categories
  for (const categoryToRemove of categoriesToRemove) {
    await prismaClient.category.update({
      where: {
        name: categoryToRemove,
      },
      data: {
        products: {
          disconnect: {
            id: updatedProduct.id,
          },
        },
      },
    });
  }

  res.json(updatedProduct);
};

// Controller to delete an existing product
export const deleteProduct = async (req: Request, res: Response) => {
  const productId = +req.params.id;

  // Get the product and its categories before deletion
  const productToDelete = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      categories: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!productToDelete) {
    throw new NotFoundException(
      'Product not found!',
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  // Delete the product, including its categories
  const deletedProduct = await prismaClient.product.delete({
    where: {
      id: productId,
    },
    include: {
      categories: true,
    },
  });

  // Remove the product from its associated categories
  for (const category of productToDelete.categories) {
    await prismaClient.category.update({
      where: {
        name: category.name,
      },
      data: {
        products: {
          disconnect: {
            id: productId,
          },
        },
      },
    });
  }

  res.json(deletedProduct);
};

// Controller to get a list of products
export const listProducts = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();

  const products = await prismaClient.product.findMany({
    skip: req.query.skip ? +req.query.skip : 0,
    take: req.query.take ? +req.query.take : 5,
  });

  res.json({ count, data: products });
};

// Controller to get a specific product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });

    res.json(product);
  } catch (error) {
    throw new NotFoundException(
      'Product not found!',
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

// Controller to get a list of categories
export const listCategories = async (req: Request, res: Response) => {
  const count = await prismaClient.category.count();

  const categories = await prismaClient.category.findMany({
    skip: req.query.skip ? +req.query.skip : 0,
    take: req.query.take ? +req.query.take : 5,
  });
  res.json({ count, data: categories });
};

// Controller to get a list of products by category
export const listProductsByCategory = async (req: Request, res: Response) => {
  const categoryId = +req.params.id;

  // Fetch products with essential details based on category ID
  const products = await prismaClient.product.findMany({
    where: {
      categories: {
        some: {
          id: categoryId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      tags: true,
      description: true,
    },
    skip: req.query.skip ? +req.query.skip : 0,
    take: req.query.take ? +req.query.take : 5,
  });

  res.json(products);
};
