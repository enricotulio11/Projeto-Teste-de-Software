import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('localizacoes')
export class Localizacao {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column()
  endereco!: string;

  @Column()
  cidade!: string;

  @Column({ length: 2 })
  estado!: string;

  @Column({ type: 'varchar', nullable: true })
  cep!: string | null;

  @Column({ default: true })
  ativo!: boolean;

  @CreateDateColumn()
  criadoEm!: Date;
}
