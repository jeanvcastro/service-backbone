export interface DomainEvent {
  type: string;
  data: unknown;
}

export type EventHandler = (event: DomainEvent) => Promise<void>;

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventName: string, handler: EventHandler): void;
}
