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
import { error } from 'console';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    //console.log('req =>', ctx.getContext().req.headers.authorization);
    const token = this.getToken(ctx.getContext().req);
    //console.log('token => ', token);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      return true;
    } catch (error) {}
    console.log('err => ', error);
    throw new HttpException('Invalid token!', HttpStatus.UNAUTHORIZED);
    return false;
  }

  private getToken(req: any): string | undefined {
    const [type, token] = req.headers.authorization
      ? req.headers.authorization.split(' ')
      : [];
    return type === 'Bearer' ? token : undefined;
  }
}
