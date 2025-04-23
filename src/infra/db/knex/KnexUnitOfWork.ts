import { TransactionContext, UnitOfWork } from "@/core/UnityOfWork";
import type { Knex } from "knex";

export class KnexTransactionContext implements TransactionContext {
  constructor(public readonly transaction: Knex.Transaction) {}
}

export class KnexUnitOfWork implements UnitOfWork<KnexTransactionContext> {
  constructor(private readonly knex: Knex) {}

  start<T>(work: (transactionContext: KnexTransactionContext) => Promise<T>): Promise<T> {
    return this.knex.transaction(transaction => work(new KnexTransactionContext(transaction)));
  }
}
