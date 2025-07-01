import { Module } from '@nestjs/common';
import { DomainsService } from './domain.service';
import { DomainsResolver } from './domain.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DomainsResolver, DomainsService],
})
export class DomainModule {}
