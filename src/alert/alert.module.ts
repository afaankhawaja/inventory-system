import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertResolver } from './alert.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AlertResolver, AlertService, PrismaService],
  exports: [AlertService],
})
export class AlertModule {}
