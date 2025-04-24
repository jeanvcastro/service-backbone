import { DomainEvent } from "@/shared/kernel/EventBus";
import { RabbitMQEventBus } from "./RabbitMQEventBus";

export async function setupEventListeners(eventBus: RabbitMQEventBus) {
  await eventBus.subscribe("order.created", async (event: DomainEvent) => {
    console.log("[EmailService] Order created:", event.data);
  });
}
