import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { DependentesModule } from './dependentes/dependentes.module';
import { Agendamento } from './entidades/agendamento.entity';
import { ConfiguracoesSistema } from './entidades/configuracoes-sistema.entity';
import { Dependente } from './entidades/dependente.entity';
import { Especialidade } from './entidades/especialidade.entity';
import { Localizacao } from './entidades/localizacao.entity';
import { Log } from './entidades/log.entity';
import { Usuario } from './entidades/usuario.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: configService.get<string>('DB_PATH') ?? 'medagenda.sqlite',
        entities: [
          Usuario,
          Dependente,
          Agendamento,
          Especialidade,
          Localizacao,
          Log,
          ConfiguracoesSistema,
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    DependentesModule,
    AgendamentosModule,
    CatalogosModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
