import { EmailService } from "@/domain/services/EmailService";
import { SendOrderNotificationInput } from "./SendOrderNotificationInput";

export class SendOrderNotificationUseCase {
  constructor(private readonly emailService: EmailService) {}

  async execute({ orderUuid, name, email }: SendOrderNotificationInput): Promise<void> {
    const subject = `Order ${orderUuid} notification`;

    await this.emailService.sendEmail(
      {
        to: { email, name },
        subject
      },
      "OrderCreated",
      {
        orderUuid,
        name
      }
    );
  }
}
