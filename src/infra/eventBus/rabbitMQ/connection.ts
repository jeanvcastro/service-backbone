import { rabbitmqUrl } from "@/shared/env";
import amqp, { ChannelModel } from "amqplib";

export async function createRabbitMQConnection(): Promise<ChannelModel> {
  return amqp.connect(rabbitmqUrl);
}
