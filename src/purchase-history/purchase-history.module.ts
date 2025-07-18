import { Module } from '@nestjs/common';
import { PurchaseHistoryService } from './purchase-history.service';
import { PurchaseHistoryResolver } from './purchase-history.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PurchaseHistoryResolver, PurchaseHistoryService],
})
export class PurchaseHistoryModule {}
