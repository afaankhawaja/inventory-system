import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from 'src/@generated/user/user.model';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { UserUpdateInput } from 'src/@generated/user/user-update.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { UsersPaginated } from 'src/pagination-dto/users-paginated.models';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  createUser(@Args('createUserInput') createUserInput: UserCreateInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  signupUser(@Args('createUserInput') createUserInput: UserCreateInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => UsersPaginated, { name: 'users' })
  findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    return this.usersService.findAll(skip, take);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('userID', { type: () => String }) userID: string) {
    return this.usersService.findOne(userID);
  }
  @Query(() => User, { name: 'username' })
  findOneByUserName(
    @Args('username', { type: () => String }) username: string,
  ) {
    return this.usersService.findOneByUserName(username);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateUser(
    @Args('userID', { type: () => String }) userID: string,
    @Args('updateUserInput') updateUserInput: UserUpdateInput,
  ) {
    return this.usersService.update(userID, updateUserInput);
  }

  @Mutation(() => User)
  updateCurrentUser(
    @Args('userID', { type: () => String }) userID: string,
    @Args('updateUserInput') updateUserInput: UserUpdateInput,
  ) {
    return this.usersService.update(userID, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  removeUser(@Args('userID', { type: () => String }) userID: string) {
    return this.usersService.remove(userID);
  }
}
