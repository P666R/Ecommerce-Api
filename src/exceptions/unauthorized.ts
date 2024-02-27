import { HttpException } from './root';

// Define a custom UnauthorizedException class that extends the HttpException class
export class UnauthorizedException extends HttpException {
  constructor(message: string, errorCode: number, errors?: any) {
    super(message, errorCode, 401, errors);
  }
}
