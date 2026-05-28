import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('configuracoes_sistema')
export class ConfiguracoesSistema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 'MedAgenda' })
  nomeSistema!: string;

  @Column({ default: false })
  modoManutencao!: boolean;

  @Column({ default: true })
  permitirCadastros!: boolean;

  @Column({ default: 5 })
  limiteDependentes!: number;

  @Column({ default: 30 })
  tempoSessao!: number;

  @Column({ default: true })
  habilitarLogsSeguranca!: boolean;

  @Column({ default: false })
  exigirSenhaForte!: boolean;

  @Column({ default: false })
  habilitarNotificacoesEmail!: boolean;

  @Column({ nullable: true })
  emailNotificacao!: string | null;

  @UpdateDateColumn()
  atualizadoEm!: Date;
}
