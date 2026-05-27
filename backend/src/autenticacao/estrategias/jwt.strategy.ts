import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface PayloadJwt {
  sub: string;
  cpf: string;
  papel: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'secret_medagenda',
    });
  }

  validate(payload: PayloadJwt) {
    return { id: payload.sub, cpf: payload.cpf, papel: payload.papel };
  }
}
