import { Module } from '@nestjs/common';
import { MaintenanceScheduleService } from './maintenance-schedule.service';
import { MaintenanceScheduleResolver } from './maintenance-schedule.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MaintenanceScheduleResolver, MaintenanceScheduleService],
})
export class MaintenanceScheduleModule {}
