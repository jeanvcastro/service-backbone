import { z } from "zod";

export const SendNotificationInputValidator = z.object({
  orderUuid: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email()
});
