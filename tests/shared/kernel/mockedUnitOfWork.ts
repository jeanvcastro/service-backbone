import { TransactionContext, UnitOfWork } from "@/shared/kernel/UnityOfWork";
import { vi } from "vitest";

export const makeMockedUnitOfWork = (): UnitOfWork<TransactionContext> => ({
  start: vi.fn().mockImplementation(async work => {
    return work({} as TransactionContext);
  })
});
