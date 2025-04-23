import { CustomersRepository } from "@/core/domain/repositories/CustomersRepository";
import { vi } from "vitest";

export const mockedCustomersRepository: CustomersRepository = {
  findOne: vi.fn()
};
