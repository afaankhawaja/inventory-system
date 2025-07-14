import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Item } from '../@generated/item/item.model';

@ObjectType()
export class ItemsPaginated {
  @Field(() => [Item])
  items: Item[];

  @Field(() => Int)
  total: number;
}
