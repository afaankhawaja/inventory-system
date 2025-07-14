import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/@generated/user/user.model';

@ObjectType()
export class UsersPaginated {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  total: number;
}
