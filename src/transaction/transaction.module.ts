import { Module } from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TransactionResolver, TransactionsService],
})
export class TransactionModule {}
