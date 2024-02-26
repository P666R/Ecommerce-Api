import { Request, Response } from 'express';
import { ChangeQuantitySchema, CreateCartSchema } from '../schema/cart';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { Product, CartItem } from '@prisma/client';
import { prismaClient } from '..';
import { UnauthorizedException } from '../exceptions/unauthorized';

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);

  let cartItem: CartItem | null;

  // Check if the same product is already in the user's cart
  cartItem = await prismaClient.cartItem.findFirst({
    where: {
      userId: req.user!.id,
      productId: validatedData.productId,
    },
  });

  if (cartItem) {
    // If the product is already in the cart, update the quantity
    cartItem = await prismaClient.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity: cartItem.quantity + validatedData.quantity,
      },
    });

    return res.json(cartItem);
  }

  let product: Product;

  // If the product is not in the cart, fetch the product details
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (error) {
    throw new NotFoundException(
      'Product not found!',
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  // Create a new cart item for the user
  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.user!.id,
      productId: product.id,
      quantity: validatedData.quantity,
    },
  });

  res.json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  const cartItem = await prismaClient.cartItem.findUnique({
    where: {
      id: +req.params.id,
    },
  });

  if (!cartItem || cartItem.userId !== req.user!.id) {
    throw new UnauthorizedException('Unauthorized!', ErrorCode.UNAUTHORIZED);
  }

  await prismaClient.cartItem.delete({
    where: {
      id: +req.params.id,
    },
  });

  res.json({ success: true });
};

export const changeQuantity = async (req: Request, res: Response) => {
  const validatedData = ChangeQuantitySchema.parse(req.body);

  const cartItem = await prismaClient.cartItem.findUnique({
    where: {
      id: +req.params.id,
    },
  });

  if (!cartItem || cartItem.userId !== req.user!.id) {
    throw new UnauthorizedException('Unauthorized!', ErrorCode.UNAUTHORIZED);
  }

  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: +req.params.id,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });

  res.json(updatedCart);
};

export const getCart = async (req: Request, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user!.id,
    },
    include: {
      product: true,
    },
  });

  res.json(cart);
};
