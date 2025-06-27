import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { decrypt } from 'src/helpers/crypto';
import { UserUpdateInput } from 'src/@generated/user/user-update.input';
import { AuthTokens } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOneByUserName(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user?.password_hash) {
      const decryptedPassword = decrypt(user?.password_hash);

      if (pass !== decryptedPassword) {
        throw new UnauthorizedException();
      }
    }
    const payload = {
      sub: user.userId,
      username: user.username,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    await this.usersService.update(user.userId, {
      refresh_token,
    } as UserUpdateInput);
    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersService.findOne(payload.sub);
      if (!user || user.refresh_token !== refreshToken) {
        throw new UnauthorizedException();
      }
      const newPayload = { sub: user.userId, username: user.username };
      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '15m',
      });
      return { access_token: newAccessToken, refresh_token: refreshToken };
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token has expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
