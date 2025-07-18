import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PurchaseHistoryService } from './purchase-history.service';
import { PurchaseHistory } from 'src/@generated/purchase-history/purchase-history.model';
import { PurchaseHistoryCreateInput } from 'src/@generated/purchase-history/purchase-history-create.input';
import { PurchaseHistoryUpdateInput } from 'src/@generated/purchase-history/purchase-history-update.input';

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

  @Query(() => [PurchaseHistory], { name: 'purchaseHistories' })
  findAll() {
    return this.purchaseHistoryService.findAll();
  }

  @Query(() => PurchaseHistory, { name: 'purchaseHistory' })
  findOne(@Args('purchaseID') purchaseID: string) {
    return this.purchaseHistoryService.findOne(purchaseID);
  }
}
