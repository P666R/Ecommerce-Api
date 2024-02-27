import { ErrorCode, HttpException } from './root';

// Define a custom BadRequestsException class that extends the HttpException class
export class BadRequestsException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 400, errors);
  }
}
