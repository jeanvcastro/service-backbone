import { OrderCreatedEvent } from "@/domain/events/OrderCreatedEvent";
import { RabbitMQEventBus } from "./RabbitMQEventBus";

import { handleOrderCreatedEvent } from "@/useCases/sendOrderNotification/SendOrderNotificationEventHandler";

export async function setupEventListeners(eventBus: RabbitMQEventBus) {
  await eventBus.subscribe(OrderCreatedEvent.type, handleOrderCreatedEvent);
}
