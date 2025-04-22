import { ProductsRepository } from "@/core/domain/repositories/ProductsRepository";
import { vi } from "vitest";

export const mockedProductsRepository: ProductsRepository = {
  findOne: vi.fn(),
  create: vi.fn(),
  findMany: vi.fn(),
  incrementSalesCount: vi.fn()
};
