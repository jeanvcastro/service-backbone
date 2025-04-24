import { appName } from "@/shared/env";
import { RabbitMQEventBus } from "./RabbitMQEventBus";
import { createRabbitMQConnection } from "./connection";
import { setupEventListeners } from "./setupEventListeners";

async function startEventListenerApp() {
  const eventBus = new RabbitMQEventBus(createRabbitMQConnection);
  await eventBus.init();

  await setupEventListeners(eventBus);

  console.log(`[${appName}]: Event listener app started`);
}

startEventListenerApp();
