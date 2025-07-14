import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from 'src/@generated/item/item.model';
import { ItemCreateInput } from 'src/@generated/item/item-create.input';
import { ItemUpdateInput } from 'src/@generated/item/item-update.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { ItemsPaginated } from 'src/pagination-dto/items-paginated.model';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  createItem(@Args('itemCreateInput') itemCreateInput: ItemCreateInput) {
    return this.itemsService.create(itemCreateInput);
  }

  @Mutation(() => Item)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateItem(
    @Args('itemUpdateInput') itemUpdateInput: ItemUpdateInput,
    @Args('itemID') itemID: string,
  ) {
    return this.itemsService.update(itemID, itemUpdateInput);
  }

  @Mutation(() => Item)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  removeItem(@Args('itemID') itemID: string) {
    return this.itemsService.remove(itemID);
  }

  @Query(() => ItemsPaginated, { name: 'items' })
  findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    return this.itemsService.findAll(skip, take);
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('itemID', { type: () => String }) itemID: string) {
    return this.itemsService.findOne(itemID);
  }
}
