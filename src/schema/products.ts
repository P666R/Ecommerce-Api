import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
  tags: z.array(z.string()),
});
