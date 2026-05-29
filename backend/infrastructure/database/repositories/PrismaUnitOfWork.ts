import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { ITransactionClient, IUnitOfWork } from '../../../application/ports/IUnitOfWork';

export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async run<T>(work: (tx: ITransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx: ITransactionClient) => {
      return work(tx);
    });
  }
}