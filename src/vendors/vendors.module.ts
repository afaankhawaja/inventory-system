import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsResolver } from './vendors.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VendorsResolver, VendorsService],
})
export class VendorsModule {}
