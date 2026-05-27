import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { AutenticacaoModule } from './autenticacao/autenticacao.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'medagenda.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuariosModule,
    AutenticacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
