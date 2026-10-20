import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/roles/role.enum';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_MS = 24 * 60 * 60 * 1000;

export interface JwtPayload {
  sub: string;
  username: string;
  role?: Role;
  /** token version - must match User.token_version, otherwise token is revoked */
  tv: number;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  private cookieOptions(maxAge: number) {
    return {
      httpOnly: true, // not readable from JS -> XSS cannot steal the token
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const, // blocks cross-site POSTs (CSRF)
      path: '/',
      maxAge,
    };
  }

  private async setAuthCookies(
    res: Response,
    user: {
      userId: string;
      username: string | null;
      token_version: number;
      role?: { name: string | null } | null;
    },
  ) {
    const base = {
      sub: user.userId,
      username: user.username ?? '',
      role: user.role?.name as Role,
      tv: user.token_version,
    };
    const access = await this.jwtService.signAsync(
      { ...base, type: 'access' },
      { expiresIn: '15m' },
    );
    const refresh = await this.jwtService.signAsync(
      { ...base, type: 'refresh' },
      { expiresIn: '1d' },
    );
    res.cookie(ACCESS_COOKIE, access, this.cookieOptions(ACCESS_TTL_MS));
    res.cookie(REFRESH_COOKIE, refresh, this.cookieOptions(REFRESH_TTL_MS));
  }

  clearAuthCookies(res: Response) {
    const { maxAge: _ignored, ...opts } = this.cookieOptions(0);
    res.clearCookie(ACCESS_COOKIE, opts);
    res.clearCookie(REFRESH_COOKIE, opts);
  }

  async signIn(username: string, pass: string, res: Response) {
    const user = await this.usersService.findOneByUserName(username);
    if (!user || !user.password_hash) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch || user.is_active === false) {
      throw new UnauthorizedException();
    }
    await this.setAuthCookies(res, user);
    return true;
  }

  async refreshToken(refreshToken: string | undefined, res: Response) {
    if (!refreshToken) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
      );
      const user = await this.usersService.findOne(payload.sub);
      if (
        payload.type !== 'refresh' ||
        !user ||
        user.is_active === false ||
        user.token_version !== payload.tv
      ) {
        throw new UnauthorizedException();
      }
      await this.setAuthCookies(res, user);
      return true;
    } catch (e) {
      this.clearAuthCookies(res);
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token has expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /** Revokes every access/refresh token issued so far for this user. */
  async logout(userId: string, res: Response) {
    await this.prisma.user.update({
      where: { userId },
      data: { token_version: { increment: 1 }, refresh_token: null },
    });
    this.clearAuthCookies(res);
    return true;
  }
}
