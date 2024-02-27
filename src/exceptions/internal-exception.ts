import { HttpException } from './root';

// Define a custom internalException class that extends the HttpException class
export class internalException extends HttpException {
  constructor(message: string, errors: any, errorCode: number) {
    super(message, errorCode, 500, errors);
  }
}
