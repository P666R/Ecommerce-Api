import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { UnauthorizedException } from '../exceptions/unauthorized';

// Controller to create an order
export const createOrder = async (req: Request, res: Response) => {
  // Begin a database transaction
  await prismaClient.$transaction(async (tx) => {
    // Retrieve the items in the user's cart along with the associated product details
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        product: true,
      },
    });

    // If the cart is empty, return a message and exit the function
    if (cartItems.length === 0) {
      return res.json({ message: 'Cart is empty!' });
    }

    // Calculate the total price of the items in the cart
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    // Retrieve the default shipping address of the user
    const address = await tx.address.findFirst({
      where: {
        id: req.user!.defaultShippingAddress ?? 0,
      },
    });

    // Format the address for display
    const formattedAddress = address
      ? `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.country}-${address.pincode}`
      : '';

    // Create a new order in the database and create entry in orderProduct with the productId and quantity for each item in cart
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

    // Create an order event in the database
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    // Remove the items from the user's cart as they have been successfully ordered
    await tx.cartItem.deleteMany({
      where: {
        userId: req.user!.id,
      },
    });

    // Return the created order as the response
    return res.json(order);
  });
};

// Controller to get the orders
export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user!.id,
    },
  });

  res.json(orders);
};

// Controller to cancel an order
export const cancelOrder = async (req: Request, res: Response) => {
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

// Controller to get an order by ID
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

// Controller to get all orders
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

// Controller to change the status of an order
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

// Controller to get a list of orders by user
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
