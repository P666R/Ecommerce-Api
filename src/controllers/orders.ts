import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { UnauthorizedException } from '../exceptions/unauthorized';

export const createOrder = async (req: Request, res: Response) => {
  // 1. to create a transaction
  // 2. to list all the cart items and proceed if cart is not empty
  // 3. calculate the total amount
  // 4. fetch address of user
  // 5. to define computed field for formatted address on address module
  // 6. we will create a order and order productsorder products
  // 7. create event
  // 8. to empty the cart

  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.json({ message: 'Cart is empty!' });
    }

    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const address = await tx.address.findFirst({
      where: {
        id: req.user!.defaultShippingAddress ?? 0,
      },
    });

    const formattedAddress = address
      ? `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.country}-${address.pincode}`
      : '';

    const order = await tx.order.create({
      data: {
        userId: req.user!.id,
        netAmount: price,
        address: formattedAddress,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        userId: req.user!.id,
      },
    });

    return res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user!.id,
    },
  });

  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  // 1. wrap it inside transaction
  // 2. check if the user is cancelling its own order

  return await prismaClient.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (!order || order.userId !== req.user!.id) {
      throw new UnauthorizedException('Unauthorized!', ErrorCode.UNAUTHORIZED);
    }

    try {
      const cancelledOrder = await tx.order.update({
        where: {
          id: +req.params.id,
        },
        data: {
          status: 'CANCELLED',
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: cancelledOrder.id,
          status: 'CANCELLED',
        },
      });

      return res.json(cancelledOrder);
    } catch (error) {
      throw new NotFoundException(
        'Order not found!',
        ErrorCode.ORDER_NOT_FOUND
      );
    }
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });

    res.json(order);
  } catch (error) {
    throw new NotFoundException('Order not found!', ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};

  const status = req.query.status;
  if (status) {
    whereClause = {
      status,
    };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: req.query.skip ? +req.query.skip : 0,
    take: req.query.take ? +req.query.take : 5,
  });

  res.json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    try {
      const order = await tx.order.update({
        where: {
          id: +req.params.id,
        },
        data: {
          status: req.body.status,
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: req.body.status,
        },
      });

      res.json(order);
    } catch (error) {
      throw new NotFoundException(
        'Order not found!',
        ErrorCode.ORDER_NOT_FOUND
      );
    }
  });
};

export const listUserOrders = async (req: Request, res: Response) => {
  let whereClause: any = {
    userId: +req.params.id,
  };

  const status = req.query.status;
  if (status) {
    whereClause = {
      ...whereClause,
      status,
    };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: req.query.skip ? +req.query.skip : 0,
    take: req.query.take ? +req.query.take : 5,
  });

  res.json(orders);
};
