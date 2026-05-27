import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Agendamento } from './agendamento.entity';

@Entity('dependentes')
export class Dependente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true, length: 11 })
  cpf: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.dependentes, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;

  @Column()
  usuarioId: string;

  @OneToMany(() => Agendamento, (age) => age.dependente)
  agendamentos: Agendamento[];
}
