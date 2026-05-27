import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type PapelUsuario = 'admin' | 'medico' | 'paciente' | 'recepcionista';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senhaHash: string;

  @Column({ default: 'paciente' })
  papel: PapelUsuario;

  @Column({ default: true })
  ativo: boolean;

  @Column({ default: false })
  bloqueado: boolean;

  @Column({ default: 0 })
  tentativasLogin: number;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
