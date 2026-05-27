import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

export type TipoLog =
  | 'login'
  | 'logout'
  | 'login_falhou'
  | 'senha_redefinida'
  | 'pin_redefinido'
  | 'usuario_bloqueado'
  | 'usuario_desbloqueado'
  | 'usuario_criado'
  | 'agendamento_criado'
  | 'agendamento_atualizado'
  | 'agendamento_cancelado'
  | 'dependente_criado'
  | 'dependente_removido';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipo: TipoLog;

  @Column({ type: 'text', nullable: true })
  cpfUsuario: string | null;

  @Column({ type: 'text', nullable: true })
  enderecoIp: string | null;

  @Column({ type: 'text', nullable: true })
  detalhes: string | null;

  @CreateDateColumn()
  criadoEm: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.logs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  usuario: Usuario | null;

  @Column({ type: 'text', nullable: true })
  usuarioId: string | null;
}
