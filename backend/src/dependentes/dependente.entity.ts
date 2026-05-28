import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type Parentesco =
  | 'filho'
  | 'filha'
  | 'conjuge'
  | 'pai'
  | 'mae'
  | 'irmao'
  | 'irma'
  | 'outro';

@Entity('dependentes')
export class Dependente {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column({ unique: true })
  cpf!: string;

  @Column()
  dataNascimento!: string;

  @Column()
  parentesco!: Parentesco;

  @Column()
  usuarioId!: string;

  @Column({ default: true })
  ativo!: boolean;

  @CreateDateColumn()
  criadoEm!: Date;

  @UpdateDateColumn()
  atualizadoEm!: Date;
}
