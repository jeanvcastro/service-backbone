// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DomainEvent<T = any> {
  readonly type: string;
  readonly data: T;
  readonly eventId: string;
  readonly occurredAt: Date;
}

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  (event: T): Promise<void>;
}

export interface EventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(eventName: T["type"], handler: EventHandler<T>): Promise<void>;
}
