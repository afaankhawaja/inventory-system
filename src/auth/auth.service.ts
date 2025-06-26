import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { decrypt } from 'src/helpers/crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByUserName(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const parts = user?.password_hash?.split(':');

    if (Array.isArray(parts) && parts.length === 3) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const iv = parts[0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const salt = parts[1];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = parts[2];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decryptedPassword = decrypt({ iv, salt, data });

      if (pass !== decryptedPassword) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user?.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
