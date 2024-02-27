import { Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { BadRequestsException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';
import { SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';
import { User } from '@prisma/client';

// Function to exclude specified keys from a user object
function exclude(user: User, keys: string[]) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
}

// Function to handle user signup
export const signup = async (req: Request, res: Response) => {
  // Validate request body using SignUpSchema
  SignUpSchema.parse(req.body);

  const { name, email, password } = req.body;

  // Check if user with the given email already exists
  let user = await prismaClient.user.findFirst({ where: { email } });

  // If user already exists, throw a BadRequestsException
  if (user) {
    throw new BadRequestsException(
      'User already exists!',
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  // Create a new user with the provided name, email, and hashed password
  user = await prismaClient.user.create({
    data: { name, email, password: hashSync(password, 10) },
  });

  // Exclude password from the user object
  const userWithoutPassword = exclude(user, ['password']);

  // Send the user data (without password) in the response
  res.json(userWithoutPassword);
};

// Function to handle user login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user with the given email
  let user = await prismaClient.user.findFirst({ where: { email } });

  // If user does not exist, throw a NotFoundException
  if (!user) {
    throw new NotFoundException('User not found!', ErrorCode.USER_NOT_FOUND);
  }

  // If the provided password does not match the stored password, throw a BadRequestsException
  if (!compareSync(password, user.password)) {
    throw new BadRequestsException(
      'Incorrect password!',
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  // Generate a JWT token with the user's id and the JWT_SECRET
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1d',
  });

  // Exclude password from the user object
  const userWithoutPassword = exclude(user, ['password']);

  // Send the user data (without password) and the token in the response
  res.json({ user: userWithoutPassword, token });
};

// Function to handle retrieving user profile
export const me = async (req: Request, res: Response) => {
  // Send the user data from the request in the response
  res.json(req.user);
};
