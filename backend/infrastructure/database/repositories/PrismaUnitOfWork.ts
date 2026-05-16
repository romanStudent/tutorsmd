import { PrismaClient } from '../../../generated/prisma';
import { ITransactionClient, IUnitOfWork } from '../../../application/ports/IUnitOfWork';

export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async run<T>(work: (tx: ITransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx: ITransactionClient) => {
      return work(tx);
    });
  }
}