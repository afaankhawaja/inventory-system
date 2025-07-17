import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MaintenanceScheduleService } from './maintenance-schedule.service';
import { MaintenanceSchedule } from 'src/@generated/maintenance-schedule/maintenance-schedule.model';
import { MaintenanceScheduleCreateInput } from 'src/@generated/maintenance-schedule/maintenance-schedule-create.input';
import { MaintenanceScheduleUpdateInput } from 'src/@generated/maintenance-schedule/maintenance-schedule-update.input';
import { MaintenanceSchedulePaginated } from 'src/pagination-dto/maintenance-schedule.paginated.model';

@Resolver()
export class MaintenanceScheduleResolver {
  constructor(
    private readonly maintenanceScheduleService: MaintenanceScheduleService,
  ) {}

  @Query(() => MaintenanceSchedulePaginated, { name: 'maintenanceSchedules' })
  findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    return this.maintenanceScheduleService.findAll(skip, take);
  }

  @Query(() => MaintenanceSchedule, { name: 'maintenanceSchedule' })
  findOne(@Args('maintenance_schedule_ID', { type: () => String }) id: string) {
    return this.maintenanceScheduleService.findOne(id);
  }

  @Mutation(() => MaintenanceSchedule)
  createMaintenanceSchedule(
    @Args('createMaintenanceScheduleInput')
    createMaintenanceScheduleInput: MaintenanceScheduleCreateInput,
  ) {
    return this.maintenanceScheduleService.create(
      createMaintenanceScheduleInput,
    );
  }

  @Mutation(() => MaintenanceSchedule)
  updateMaintenanceSchedule(
    @Args('maintenance_schedule_ID') maintenance_schedule_ID: string,
    @Args('statusCheck') statusCheck: string,
    @Args('updateMaintenanceScheduleInput')
    updateMaintenanceScheduleInput: MaintenanceScheduleUpdateInput,
  ) {
    return this.maintenanceScheduleService.update(
      maintenance_schedule_ID,
      updateMaintenanceScheduleInput,
    );
  }

  @Mutation(() => MaintenanceSchedule)
  removeMaintenanceSchedule(
    @Args('maintenance_schedule_ID', { type: () => String })
    maintenance_schedule_ID: string,
  ) {
    return this.maintenanceScheduleService.remove(maintenance_schedule_ID);
  }
}
