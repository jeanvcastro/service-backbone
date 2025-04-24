import { DomainEvent, EventBus, EventHandler } from "@/shared/kernel/EventBus";
import { Channel, ChannelModel } from "amqplib";

type ChannelFactory = () => Promise<ChannelModel>;

export class RabbitMQEventBus implements EventBus {
  declare private channel: Channel;

  constructor(private readonly createConnection: ChannelFactory) {}

  async init(): Promise<void> {
    const connection = await this.createConnection();
    this.channel = await connection.createChannel();
  }

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    await this.channel.assertExchange(event.type, "fanout", { durable: true });

    const message = JSON.stringify({
      type: event.type,
      data: event.data,
      eventId: event.eventId,
      occurredAt: event.occurredAt.toISOString()
    });

    this.channel.publish(event.type, "", Buffer.from(message));
  }

  async subscribe<T extends DomainEvent>(eventName: T["type"], handler: EventHandler<T>): Promise<void> {
    await this.channel.assertExchange(eventName, "fanout", { durable: true });
    const q = await this.channel.assertQueue("", { exclusive: true });
    await this.channel.bindQueue(q.queue, eventName, "");

    this.channel.consume(q.queue, async msg => {
      if (msg) {
        const parsed = JSON.parse(msg.content.toString());

        const event: DomainEvent = {
          type: parsed.type,
          data: parsed.data,
          eventId: parsed.eventId,
          occurredAt: new Date(parsed.occurredAt)
        };

        await handler(event as T);
        this.channel.ack(msg);
      }
    });
  }
}
