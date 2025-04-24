import { OrderCreatedEvent } from "@/domain/events/OrderCreatedEvent";
import { configureDI } from "./di";
import { SendOrderNotificationInput } from "./SendOrderNotificationInput";
import { SendOrderNotificationInputValidator } from "./SendOrderNotificationInputValidator";

export async function handleOrderCreatedEvent(event: OrderCreatedEvent): Promise<void> {
  const payload: SendOrderNotificationInput = {
    orderUuid: event.data.order.uuid,
    name: event.data.customer.name,
    email: event.data.customer.email
  };

  SendOrderNotificationInputValidator.parse(payload);

  const container = await configureDI();
  const useCase = container.get("SendOrderNotificationUseCase");

  await useCase.execute(payload);
}
