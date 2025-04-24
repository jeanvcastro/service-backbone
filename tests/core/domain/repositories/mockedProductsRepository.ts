import { ProductsRepository } from "@/domain/repositories/ProductsRepository";
import { vi } from "vitest";

export const mockedProductsRepository: ProductsRepository = {
  findOne: vi.fn(),
  create: vi.fn(),
  findMany: vi.fn(),
  incrementOrdersCount: vi.fn()
};
