import { z } from "zod";
import { SendOrderNotificationInput } from "./SendOrderNotificationInput";

export const SendOrderNotificationInputValidator = z.object({
  orderUuid: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email()
}) satisfies z.ZodType<SendOrderNotificationInput>;
