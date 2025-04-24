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

  async publish(event: DomainEvent): Promise<void> {
    await this.channel.assertExchange(event.type, "fanout", { durable: true });
    this.channel.publish(event.type, "", Buffer.from(JSON.stringify(event.data)));
  }

  async subscribe(eventName: string, handler: EventHandler): Promise<void> {
    await this.channel.assertExchange(eventName, "fanout", { durable: true });
    const q = await this.channel.assertQueue("", { exclusive: true });
    await this.channel.bindQueue(q.queue, eventName, "");
    this.channel.consume(q.queue, async msg => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        await handler({ type: eventName, data });
        this.channel.ack(msg);
      }
    });
  }
}
