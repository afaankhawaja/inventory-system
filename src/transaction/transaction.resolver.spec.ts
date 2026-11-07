import { PrismaService } from 'src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from './transaction.resolver';
import { TransactionsService } from './transaction.service';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: {} }, TransactionResolver, TransactionsService],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
