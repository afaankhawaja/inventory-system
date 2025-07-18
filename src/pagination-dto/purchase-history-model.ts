import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PurchaseHistory } from 'src/@generated/purchase-history/purchase-history.model';

@ObjectType()
export class PurchaseHistoryPaginated {
  @Field(() => [PurchaseHistory])
  purchases: PurchaseHistory[];

  @Field(() => Int)
  total: number;
}
