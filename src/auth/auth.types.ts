import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthTokens {
  @Field(() => String)
  access_token: string;

  @Field(() => String)
  refresh_token: string;
}
