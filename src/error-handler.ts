import { NextFunction, Request, Response } from 'express';
import { ErrorCode, HttpException } from './exceptions/root';
import { internalException } from './exceptions/internal-exception';
import { ZodError } from 'zod';
import { BadRequestsException } from './exceptions/bad-requests';

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestsException(
            'Unprocessable entity!',
            ErrorCode.UNPROCESSABLE_ENTITY,
            error
          );
        } else {
          exception = new internalException(
            'Something went wrong!',
            error,
            ErrorCode.INTERNAL_EXCEPTION
          );
        }
      }
      next(exception);
    }
  };
};