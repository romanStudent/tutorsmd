export interface IUnitOfWork {
  run<T>(work: (tx: ITransactionClient) => Promise<T>): Promise<T>;
}

export interface ITransactionClient {}