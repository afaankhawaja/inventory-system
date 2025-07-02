import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from 'src/@generated/item/item.model';
import { ItemCreateInput } from 'src/@generated/item/item-create.input';
import { ItemUpdateInput } from 'src/@generated/item/item-update.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
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
