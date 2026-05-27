import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PAPEIS_KEY } from '../decoradores/papeis.decorator.js';

@Injectable()
export class PapeisGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const papeis = this.reflector.getAllAndOverride<string[]>(PAPEIS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!papeis || papeis.length === 0) return true;

    const req = context.switchToHttp().getRequest<{ user?: { papel: string } }>();
    return papeis.includes(req.user?.papel ?? '');
  }
}
