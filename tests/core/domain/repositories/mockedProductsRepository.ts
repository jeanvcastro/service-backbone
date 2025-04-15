import { ProductsRepository } from "@/core/domain/repositories/ProductsRepository";
import { vi } from "vitest";

export const mockedProductsRepository: ProductsRepository = {
  findMany: vi.fn()
};
