import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './../@generated/user/user.model';
import { UserCreateInput } from './../@generated/user/user-create.input';
import { UserUpdateInput } from './../@generated/user/user-update.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: UserCreateInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('userID', { type: () => String }) userID: string) {
    return this.usersService.findOne(userID);
  }
  @Query(() => User, { name: 'user' })
  findOneByUserName(
    @Args('username', { type: () => String }) username: string,
  ) {
    return this.usersService.findOneByUserName(username);
  }

  @Mutation(() => User)
  updateUser(
    @Args('userID', { type: () => String }) userID: string,
    @Args('updateUserInput') updateUserInput: UserUpdateInput,
  ) {
    return this.usersService.update(userID, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('userID', { type: () => String }) userID: string) {
    return this.usersService.remove(userID);
  }
}
