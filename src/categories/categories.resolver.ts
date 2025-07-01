import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from 'src/@generated/category/category.model';
import { CategoryCreateInput } from 'src/@generated/category/category-create.input';
import { CategoryUpdateInput } from 'src/@generated/category/category-update.input';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
  createCategory(
    @Args('categoryCreateInput') categoryCreateInput: CategoryCreateInput,
  ) {
    return this.categoriesService.create(categoryCreateInput);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('categoryUpdateInput') categoryUpdateInput: CategoryUpdateInput,
    @Args('categoryID') categoryID: string,
  ) {
    return this.categoriesService.update(categoryID, categoryUpdateInput);
  }

  @Mutation(() => Category)
  removeCategory(@Args('categoryID') categoryID: string) {
    return this.categoriesService.remove(categoryID);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('categoryID') categoryID: string) {
    return this.categoriesService.findOne(categoryID);
  }
}
