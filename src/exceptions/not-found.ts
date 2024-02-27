import { ErrorCode, HttpException } from './root';

// Define a custom NotFoundException class that extends the HttpException class
export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 404, null);
  }
}
