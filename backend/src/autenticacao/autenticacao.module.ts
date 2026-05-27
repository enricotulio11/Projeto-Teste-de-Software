import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AutenticacaoController } from './autenticacao.controller.js';
import { AutenticacaoService } from './autenticacao.service.js';
import { JwtStrategy } from './estrategias/jwt.strategy.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret_medagenda',
      signOptions: { expiresIn: '8h' },
    }),
    UsuariosModule,
  ],
  controllers: [AutenticacaoController],
  providers: [AutenticacaoService, JwtStrategy],
})
export class AutenticacaoModule {}
