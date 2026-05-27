import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Dependente } from './dependente.entity';
import { Especialidade } from './especialidade.entity';
import { Localizacao } from './localizacao.entity';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  data: string;

  @Column({ length: 5 })
  horario: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.agendamentos, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;

  @Column()
  usuarioId: string;

  @ManyToOne(() => Dependente, (dep) => dep.agendamentos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  dependente: Dependente | null;

  @Column({ type: 'text', nullable: true })
  dependenteId: string | null;

  @Column()
  nomePaciente: string;

  @ManyToOne(() => Especialidade, { eager: true })
  especialidade: Especialidade;

  @Column()
  especialidadeId: string;

  @ManyToOne(() => Localizacao, { eager: true })
  localizacao: Localizacao;

  @Column()
  localizacaoId: string;
}
