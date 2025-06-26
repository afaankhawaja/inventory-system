import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String, { name: 'signin' })
  async signIn(
    @Args('username', { type: () => String }) username: string,
    @Args('password', { type: () => String }) password: string,
  ): Promise<string> {
    const { access_token } = await this.authService.signIn(username, password);
    return access_token;
  }
}
