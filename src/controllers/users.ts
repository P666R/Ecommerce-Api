import { Request, Response } from 'express';
import { AddressSchema, UpdateUserSchema } from '../schema/users';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { Address } from '@prisma/client';
import { BadRequestsException } from '../exceptions/bad-requests';
import { User } from '@prisma/client';

// Function to exclude specified keys from a user object
function exclude(user: User, keys: string[]) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
}

// Controller to add an address for the current user
export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user!.id,
    },
  });

  res.json(address);
};

// Controller to delete an address by ID
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.json({ success: true });
  } catch (error) {
    throw new NotFoundException(
      'Address not found!',
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

// Controller to get a list of addresses for the current user
export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user!.id,
    },
  });

  res.json(addresses);
};

// Controller to update the current user shipping and billing addresses
export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);

  let shippingAddress: Address;
  let billingAddress: Address;

  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        'Address not found!',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (shippingAddress.userId !== req.user!.id) {
      throw new BadRequestsException(
        'Address does not belong to user!',
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        'Address not found!',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (billingAddress.userId !== req.user!.id) {
      throw new BadRequestsException(
        'Address does not belong to user!',
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user!.id,
    },
    data: validatedData,
  });

  const userWithoutPassword = exclude(updatedUser, ['password']);

  res.json(userWithoutPassword);
};

// Controller to get a list of users
export const listUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    skip: req.query.skip ? +req.query.skip : 0,
    take: req.query.take ? +req.query.take : 5,
  });

  const usersWithoutPassword = users.map((user) => {
    return exclude(user, ['password']);
  });

  res.json(usersWithoutPassword);
};

// Controller to get a specific user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        addresses: true,
      },
    });

    const userWithoutPassword = exclude(user, ['password']);

    res.json(userWithoutPassword);
  } catch (error) {
    throw new NotFoundException('User not found!', ErrorCode.USER_NOT_FOUND);
  }
};

// Controller to change a user's role
export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        role: req.body.role,
      },
    });

    const userWithoutPassword = exclude(user, ['password']);

    res.json(userWithoutPassword);
  } catch (error) {
    throw new NotFoundException('User not found!', ErrorCode.USER_NOT_FOUND);
  }
};
