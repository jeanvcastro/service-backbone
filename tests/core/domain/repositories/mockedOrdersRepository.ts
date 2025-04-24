import { OrdersRepository } from "@/domain/repositories/OrdersRepository";
import { vi } from "vitest";

export const mockedOrdersRepository: OrdersRepository = {
  create: vi.fn()
};
