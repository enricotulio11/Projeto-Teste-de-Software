import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Dependente } from './dependente.entity';
import { Agendamento } from './agendamento.entity';
import { Log } from './log.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true, length: 11 })
  cpf: string;

  @Column()
  senha: string;

  @Column({ length: 60 })
  pin: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 'ativo' })
  status: 'ativo' | 'inativo';

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @OneToMany(() => Dependente, (dep) => dep.usuario, { cascade: true })
  dependentes: Dependente[];

  @OneToMany(() => Agendamento, (age) => age.usuario, { cascade: true })
  agendamentos: Agendamento[];

  @OneToMany(() => Log, (log) => log.usuario)
  logs: Log[];
}
