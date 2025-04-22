// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TransactionContext {}

export interface UnitOfWork<CTX extends TransactionContext> {
  /**
   * Starts the transaction and passes a concrete CTX to the callback.
   * Commits if resolved, rolls back if rejected.
   */
  start<T>(work: (transactionContext: CTX) => Promise<T>): Promise<T>;
}
