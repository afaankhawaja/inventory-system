import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceScheduleResolver } from './maintenance-schedule.resolver';
import { MaintenanceScheduleService } from './maintenance-schedule.service';

describe('MaintenanceScheduleResolver', () => {
  let resolver: MaintenanceScheduleResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceScheduleResolver, MaintenanceScheduleService],
    }).compile();

    resolver = module.get<MaintenanceScheduleResolver>(MaintenanceScheduleResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
