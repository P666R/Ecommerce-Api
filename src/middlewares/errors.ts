import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/root';

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, errorCode, statusCode, errors } = error;
  res.status(statusCode).json({
    message,
    errorCode,
    errors,
  });
};
