import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String) // This defines a simple query that returns a String
  hello(): string {
    return 'Hello, GraphQL!';
  }
}
