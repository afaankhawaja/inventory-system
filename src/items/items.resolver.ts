import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from 'src/@generated/item/item.model';
import { ItemCreateInput } from 'src/@generated/item/item-create.input';
import { ItemUpdateInput } from 'src/@generated/item/item-update.input';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  createItem(@Args('itemCreateInput') itemCreateInput: ItemCreateInput) {
    return this.itemsService.create(itemCreateInput);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('itemUpdateInput') itemUpdateInput: ItemUpdateInput,
    @Args('itemID') itemID: string,
  ) {
    return this.itemsService.update(itemID, itemUpdateInput);
  }

  @Mutation(() => Item)
  removeItem(@Args('itemID') itemID: string) {
    return this.itemsService.remove(itemID);
  }

  @Query(() => [Item], { name: 'items' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Query(() => Item)
  findOne(@Args('itemID') itemID: string) {
    return this.itemsService.findOne(itemID);
  }
}
