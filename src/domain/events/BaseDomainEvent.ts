import { DomainEvent } from "@/shared/kernel/EventBus";
import { randomUUID } from "crypto";

export abstract class BaseDomainEvent<T> implements DomainEvent<T> {
  static readonly type: string;

  readonly eventId: string;
  readonly occurredAt: Date;

  constructor(
    public readonly type: string,
    public readonly data: T
  ) {
    this.eventId = randomUUID();
    this.occurredAt = new Date();
  }
}
