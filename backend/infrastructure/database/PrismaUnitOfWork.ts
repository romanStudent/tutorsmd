import { PrismaClient } from '@prisma/client';
import { IUnitOfWork, ITransactionClient } from '../../application/ports/IUnitOfWork';

export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async run<T>(work: (tx: ITransactionClient) => Promise<T>): Promise<T> {
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        return await this.prisma.$transaction(async (tx: ITransactionClient) => {
          return await work(tx);
        });
      } catch (err: any) {
        // P2034 — deadlock или write conflict
        if (err?.code === 'P2034' && attempt < MAX_RETRIES - 1) {
          attempt++;
          // небольшая пауза перед retry
          await new Promise(resolve => setTimeout(resolve, 50 * attempt));
          continue;
        }
        throw err;
      }
    }

    throw new Error('Transaction failed after max retries');
  }
}