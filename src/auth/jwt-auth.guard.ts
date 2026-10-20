import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { ACCESS_COOKIE, JwtPayload } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext<{
      req: Request;
    }>();
    const token = (
      ctx.req.cookies as Record<string, string> | undefined
    )?.[ACCESS_COOKIE];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      if (payload.type !== 'access') throw new UnauthorizedException();

      // Revocation check: token version must match the one stored in DB
      const user = await this.prisma.user.findUnique({
        where: { userId: payload.sub },
        select: {
          userId: true,
          username: true,
          token_version: true,
          is_active: true,
          role: { select: { name: true } },
        },
      });
      if (!user || user.is_active === false || user.token_version !== payload.tv) {
        throw new UnauthorizedException();
      }
      ctx['user'] = {
        ...payload,
        role: user.role?.name, // always use the up-to-date role
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
