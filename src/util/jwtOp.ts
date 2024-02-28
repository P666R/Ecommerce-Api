import jwt, { VerifyErrors } from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

// Function to extract the user id from the token
export const extractUserIdFromToken = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        reject(err);
      } else {
        const userId = decoded.userId;
        resolve(userId);
      }
    });
  });
};
