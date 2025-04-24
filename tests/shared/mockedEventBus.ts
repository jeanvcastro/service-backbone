import { EventBus } from "@/shared/kernel/EventBus";
import { vi } from "vitest";

export const mockedEventBus: EventBus = {
  publish: vi.fn(),
  subscribe: vi.fn()
};
