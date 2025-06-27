import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthTokens } from './auth.types';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthTokens, { name: 'signin' })
  async signIn(
    @Args('username', { type: () => String }) username: string,
    @Args('password', { type: () => String }) password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return await this.authService.signIn(username, password);
  }

  @Mutation(() => AuthTokens, { name: 'refreshToken' })
  async refreshToken(
    @Args('refresh_token', { type: () => String }) refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return await this.authService.refreshToken(refreshToken);
  }
}
