import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaintenanceSchedule } from 'src/@generated/maintenance-schedule/maintenance-schedule.model';

@ObjectType()
export class MaintenanceSchedulePaginated {
  @Field(() => [MaintenanceSchedule])
  maintenanceSchedules: MaintenanceSchedule[];

  @Field(() => Int)
  total: number;
}
