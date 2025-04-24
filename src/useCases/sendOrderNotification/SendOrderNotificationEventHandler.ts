import { OrderCreatedEvent } from "@/domain/events/OrderCreatedEvent";
import { configureDI } from "./di";

export async function handleOrderCreatedEvent(event: OrderCreatedEvent): Promise<void> {
  const container = await configureDI();

  const useCase = container.get("SendOrderNotificationUseCase");

  await useCase.execute({
    orderUuid: event.data.order.uuid,
    name: event.data.customer.name,
    email: event.data.customer.email
  });
}
