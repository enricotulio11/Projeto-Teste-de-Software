import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type StatusAgendamento = 'agendado' | 'confirmado' | 'cancelado' | 'concluido' | 'falta';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  pacienteId!: string;

  @Column()
  medicoId!: string;

  @Column({ nullable: true })
  dependenteId!: string | null;

  @Column()
  especialidadeId!: string;

  @Column()
  localizacaoId!: string;

  @Column()
  dataHora!: string;

  @Column({ default: 30 })
  duracao!: number;

  @Column({ default: 'agendado' })
  status!: StatusAgendamento;

  @Column({ nullable: true })
  motivo!: string | null;

  @Column({ nullable: true })
  observacoes!: string | null;

  @CreateDateColumn()
  criadoEm!: Date;

  @UpdateDateColumn()
  atualizadoEm!: Date;
}
