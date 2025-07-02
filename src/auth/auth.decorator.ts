import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthedUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) =>
    GqlExecutionContext.create(ctx).getContext<{ user: object }>().user,
);
