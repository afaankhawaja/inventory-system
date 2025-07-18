import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PurchaseHistoryService } from './purchase-history.service';
import { PurchaseHistory } from 'src/@generated/purchase-history/purchase-history.model';
import { PurchaseHistoryCreateInput } from 'src/@generated/purchase-history/purchase-history-create.input';
import { PurchaseHistoryUpdateInput } from 'src/@generated/purchase-history/purchase-history-update.input';
import { PurchaseHistoryPaginated } from 'src/pagination-dto/purchase-history-model';

@Resolver(() => PurchaseHistory)
export class PurchaseHistoryResolver {
  constructor(
    private readonly purchaseHistoryService: PurchaseHistoryService,
  ) {}

  @Mutation(() => PurchaseHistory)
  createPurchaseHistory(
    @Args('purchaseHistoryCreateInput')
    purchaseHistoryCreateInput: PurchaseHistoryCreateInput,
  ) {
    return this.purchaseHistoryService.create(purchaseHistoryCreateInput);
  }

  @Mutation(() => PurchaseHistory)
  updatePurchaseHistory(
    @Args('purchaseHistoryUpdateInput')
    purchaseHistoryUpdateInput: PurchaseHistoryUpdateInput,
    @Args('purchaseID') purchaseID: string,
  ) {
    return this.purchaseHistoryService.update(
      purchaseID,
      purchaseHistoryUpdateInput,
    );
  }

  @Mutation(() => PurchaseHistory)
  removePurchaseHistory(@Args('purchaseID') purchaseID: string) {
    return this.purchaseHistoryService.remove(purchaseID);
  }

  @Query(() => PurchaseHistoryPaginated, { name: 'purchaseHistories' })
  findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    return this.purchaseHistoryService.findAll(skip, take);
  }

  @Query(() => PurchaseHistory, { name: 'purchaseHistory' })
  findOne(@Args('purchaseID') purchaseID: string) {
    return this.purchaseHistoryService.findOne(purchaseID);
  }
}
