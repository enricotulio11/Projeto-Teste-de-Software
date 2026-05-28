import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type AcaoLog =
  | 'login'
  | 'logout'
  | 'cadastro'
  | 'atualizacao'
  | 'remocao'
  | 'bloqueio'
  | 'acesso_negado';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  usuarioId!: string;

  @Column()
  acao!: AcaoLog;

  @Column({ type: 'text', nullable: true })
  detalhes!: string | null;

  @Column({ type: 'varchar', nullable: true })
  ip!: string | null;

  @CreateDateColumn()
  criadoEm!: Date;
}
