import { appName } from "@/shared/env";
import { createRabbitMQConnection } from "./rabbitMQ/connection";
import { RabbitMQEventBus } from "./rabbitMQ/RabbitMQEventBus";
import { setupEventListeners } from "./rabbitMQ/registerEventHandlers";

async function startEventListenerApp() {
  const eventBus = new RabbitMQEventBus(createRabbitMQConnection);
  await eventBus.init();

  await setupEventListeners(eventBus);

  console.log(`[${appName}]: Event listener app started`);
}

startEventListenerApp();
