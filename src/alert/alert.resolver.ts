import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AlertService } from './alert.service';
import { Alert } from 'src/@generated/alert/alert.model';
import { ItemAlert } from 'src/@generated/item-alert/item-alert.model';
import { AlertsPaginated } from 'src/pagination-dto/alerts-paginated.model';

@Resolver(() => Alert)
export class AlertResolver {
  constructor(private readonly alertService: AlertService) {}

  @Query(() => AlertsPaginated, { name: 'alerts' })
  alerts(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    return this.alertService.findAllAlerts(skip, take);
  }

  @Query(() => Alert)
  alert(@Args('alertId') alertId: string) {
    return this.alertService.findAlertById(alertId);
  }

  @Query(() => [ItemAlert])
  itemAlerts(@Args('itemId') itemId: string) {
    return this.alertService.findItemAlerts(itemId);
  }
}
