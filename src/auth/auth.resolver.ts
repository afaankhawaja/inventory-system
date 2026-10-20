import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService, REFRESH_COOKIE } from './auth.service';
import { AuthGuard } from './jwt-auth.guard';
import { AuthedUser } from './auth.decorator';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/@generated/user/user.model';

interface GqlContext {
  req: Request;
  res: Response;
}

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => Boolean, { name: 'signin' })
  async signIn(
    @Args('username', { type: () => String }) username: string,
    @Args('password', { type: () => String }) password: string,
    @Context() { res }: GqlContext,
  ): Promise<boolean> {
    return await this.authService.signIn(username, password, res);
  }

  @Mutation(() => Boolean, { name: 'refreshToken' })
  async refreshToken(@Context() { req, res }: GqlContext): Promise<boolean> {
    const token = (req.cookies as Record<string, string> | undefined)?.[
      REFRESH_COOKIE
    ];
    return await this.authService.refreshToken(token, res);
  }

  @Mutation(() => Boolean, { name: 'logout' })
  @UseGuards(AuthGuard)
  async logout(
    @AuthedUser() user: { sub: string },
    @Context() { res }: GqlContext,
  ): Promise<boolean> {
    return await this.authService.logout(user.sub, res);
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(AuthGuard)
  me(@AuthedUser() user: { sub: string }) {
    return this.usersService.findOne(user.sub);
  }
}
