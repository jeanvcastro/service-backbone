import { SalesRepository } from "@/core/domain/repositories/SalesRepository";
import { vi } from "vitest";

export const mockedSalesRepository: SalesRepository = {
  create: vi.fn()
};
