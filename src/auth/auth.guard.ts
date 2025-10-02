import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const token = this.getToken(req);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });

      // 🔑 gắn payload vào req.user để resolver có thể dùng
      req.user = payload;

      return true;
    } catch (err) {
      console.log('JWT error => ', err);
      throw new HttpException('Invalid token!', HttpStatus.UNAUTHORIZED);
    }
  }

  private getToken(req: any): string | undefined {
    const [type, token] = req.headers.authorization
      ? req.headers.authorization.split(' ')
      : [];
    return type === 'Bearer' ? token : undefined;
  }
}
