import { HttpException } from './root';

// Define a custom UnprocessableEntity class that extends the HttpException class
export class UnprocessableEntity extends HttpException {
  constructor(error: any, message: string, errorCode: number) {
    super(message, errorCode, 422, error);
  }
}
