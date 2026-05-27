# MedAgenda — Arquitetura Backend (NestJS)

Stack: **NestJS + TypeORM + SQLite + JWT**

---

## Ordem de Implementação dos Módulos

Cada módulo é implementado por completo antes de passar para o próximo:
`entity` → `module` → `service` → `controller` → `dto/`

| # | Módulo | Motivo |
|---|--------|--------|
| 1 | **Logs** | Injetado internamente pelos outros módulos; sem dependências externas |
| 2 | **Configurações** | Usado por Autenticação (registros habilitados) e Dependentes (limite) |
| 3 | **Especialidades** | Tabela de apoio para Agendamentos; sem dependências |
| 4 | **Localizações** | Tabela de apoio para Agendamentos; sem dependências |
| 5 | **Usuários** | Gestão de responsáveis; depende de Logs |
| 6 | **Autenticação** | Login, registro e JWT; depende de Usuários, Configurações e Logs |
| 7 | **Dependentes** | Depende de Usuários, Configurações e Logs |
| 8 | **Agendamentos** | Depende de Especialidades, Localizações, Dependentes e Logs |
| 9 | **Painel** | Consolidado final; depende de tudo |

---

## Estrutura de Pastas

```
medagenda-api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── logs/
│   │   ├── log.entity.ts
│   │   ├── logs.module.ts
│   │   ├── logs.controller.ts
│   │   └── logs.service.ts
│   │
│   ├── configuracoes/
│   │   ├── configuracoes-sistema.entity.ts
│   │   ├── configuracoes.module.ts
│   │   ├── configuracoes.controller.ts
│   │   ├── configuracoes.service.ts
│   │   └── dto/
│   │       └── atualizar-configuracoes.dto.ts
│   │
│   ├── especialidades/
│   │   ├── especialidade.entity.ts
│   │   ├── especialidades.module.ts
│   │   ├── especialidades.controller.ts
│   │   ├── especialidades.service.ts
│   │   └── dto/
│   │       ├── criar-especialidade.dto.ts
│   │       └── atualizar-especialidade.dto.ts
│   │
│   ├── localizacoes/
│   │   ├── localizacao.entity.ts
│   │   ├── localizacoes.module.ts
│   │   ├── localizacoes.controller.ts
│   │   ├── localizacoes.service.ts
│   │   └── dto/
│   │       ├── criar-localizacao.dto.ts
│   │       └── atualizar-localizacao.dto.ts
│   │
│   ├── usuarios/
│   │   ├── usuario.entity.ts
│   │   ├── usuarios.module.ts
│   │   ├── usuarios.controller.ts
│   │   ├── usuarios.service.ts
│   │   └── dto/
│   │       ├── atualizar-usuario.dto.ts
│   │       └── atualizar-status.dto.ts
│   │
│   ├── autenticacao/
│   │   ├── autenticacao.module.ts
│   │   ├── autenticacao.controller.ts
│   │   ├── autenticacao.service.ts
│   │   ├── estrategias/
│   │   │   └── jwt.strategy.ts
│   │   ├── guardas/
│   │   │   ├── jwt-autenticacao.guard.ts
│   │   │   └── papeis.guard.ts
│   │   ├── decoradores/
│   │   │   ├── usuario-atual.decorator.ts
│   │   │   └── papeis.decorator.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── cadastro.dto.ts
│   │
│   ├── dependentes/
│   │   ├── dependente.entity.ts
│   │   ├── dependentes.module.ts
│   │   ├── dependentes.controller.ts
│   │   ├── dependentes.service.ts
│   │   └── dto/
│   │       ├── criar-dependente.dto.ts
│   │       └── atualizar-dependente.dto.ts
│   │
│   ├── agendamentos/
│   │   ├── agendamento.entity.ts
│   │   ├── agendamentos.module.ts
│   │   ├── agendamentos.controller.ts
│   │   ├── agendamentos.service.ts
│   │   └── dto/
│   │       ├── criar-agendamento.dto.ts
│   │       └── atualizar-agendamento.dto.ts
│   │
│   └── painel/
│       ├── painel.module.ts
│       ├── painel.controller.ts
│       └── painel.service.ts
│
├── database/
│   └── medagenda.sqlite
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Variáveis de Ambiente (.env)

```env
PORT=3000
JWT_SECRET=medagenda_super_secret_key
JWT_EXPIRES_IN=7d
ADMIN_CPF=00000000000
ADMIN_PASSWORD=111111
ADMIN_PIN=2222
DB_PATH=./database/medagenda.sqlite
MAX_DEPENDENTS=5
SESSION_TIMEOUT=30
```

---

## Entidades (TypeORM)

### `usuario.entity.ts`

```typescript
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true, length: 11 })
  cpf: string;

  @Column()
  senha: string;  // hash bcrypt

  @Column({ length: 4 })
  pin: string;    // hash bcrypt

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
```

### `dependente.entity.ts`

```typescript
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

  @ManyToOne(() => Usuario, (usuario) => usuario.dependentes, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @Column()
  usuarioId: string;

  @OneToMany(() => Agendamento, (age) => age.dependente)
  agendamentos: Agendamento[];
}
```

### `agendamento.entity.ts`

```typescript
@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  data: string;  // YYYY-MM-DD

  @Column({ length: 5 })
  horario: string;  // HH:mm

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  // Responsável dono do agendamento
  @ManyToOne(() => Usuario, (usuario) => usuario.agendamentos, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @Column()
  usuarioId: string;

  // Paciente: pode ser o próprio responsável (dependenteId null) ou um dependente
  @ManyToOne(() => Dependente, (dep) => dep.agendamentos, { nullable: true, onDelete: 'SET NULL' })
  dependente: Dependente | null;

  @Column({ nullable: true })
  dependenteId: string | null;

  // Nome snapshot (desnormalizado para exibição mesmo se dependente for deletado)
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
```

### `especialidade.entity.ts`

```typescript
@Entity('especialidades')
export class Especialidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;
}
```

### `localizacao.entity.ts`

```typescript
@Entity('localizacoes')
export class Localizacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;    // Ex: "São Paulo SP"

  @Column()
  cidade: string;  // Ex: "São Paulo"

  @Column({ length: 2 })
  estado: string;  // Ex: "SP"

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;
}
```

### `log.entity.ts`

```typescript
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

  @Column({ nullable: true })
  cpfUsuario: string;

  @Column({ nullable: true })
  enderecoIp: string;

  @Column({ type: 'text', nullable: true })
  detalhes: string;

  @CreateDateColumn()
  criadoEm: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.logs, { nullable: true, onDelete: 'SET NULL' })
  usuario: Usuario | null;

  @Column({ nullable: true })
  usuarioId: string | null;
}
```

### `configuracoes-sistema.entity.ts`

```typescript
@Entity('configuracoes_sistema')
export class ConfiguracoesSistema {
  @PrimaryGeneratedColumn()
  id: number;  // Sempre id=1 (singleton)

  @Column({ default: 'MedAgenda' })
  nomeSistema: string;

  @Column({ default: false })
  modoManutencao: boolean;

  @Column({ default: true })
  permitirCadastros: boolean;

  @Column({ default: 5 })
  limiteDependentes: number;

  @Column({ default: 30 })
  tempoSessao: number;  // minutos

  @Column({ default: true })
  habilitarLogsSeguranca: boolean;

  @Column({ default: false })
  exigirSenhaForte: boolean;

  @Column({ default: false })
  habilitarNotificacoesEmail: boolean;

  @Column({ nullable: true })
  emailNotificacao: string;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
```

---

## Módulo Principal

### `app.module.ts`

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH,
      entities: [Usuario, Dependente, Agendamento, Especialidade, Localizacao, Log, ConfiguracoesSistema],
      synchronize: true,  // apenas dev; em prod usar migrations
    }),
    AutenticacaoModule,
    UsuariosModule,
    DependentesModule,
    AgendamentosModule,
    EspecialidadesModule,
    LocalizacoesModule,
    LogsModule,
    ConfiguracoesModule,
    PainelModule,
  ],
})
export class AppModule {}
```

---

## Módulo de Autenticação

### Endpoints

| Método | Rota | Guarda | Descrição |
|--------|------|--------|-----------|
| `POST` | `/auth/login` | Público | Login com CPF + senha + PIN |
| `POST` | `/auth/cadastro` | Público (se cadastros habilitados) | Criar conta |
| `POST` | `/auth/logout` | JWT | Registrar logout nos logs |
| `GET` | `/auth/eu` | JWT | Dados do usuário logado |
| `PATCH` | `/auth/eu` | JWT | Atualizar nome do usuário logado |
| `PATCH` | `/auth/eu/senha` | JWT | Alterar senha (requer senha atual) |
| `PATCH` | `/auth/eu/pin` | JWT | Alterar PIN (requer senha atual) |

### `autenticacao.service.ts` — Métodos

```typescript
// Valida credenciais e retorna JWT
login(dto: LoginDto, ip: string): Promise<{ token: string; usuario: RespostaUsuarioDto }>

// Cria novo usuário após validações
cadastrar(dto: CadastroDto): Promise<RespostaUsuarioDto>

// Registra evento de logout no log
logout(usuarioId: string, ip: string): Promise<void>

// Retorna usuário pelo id do payload JWT
buscarEu(usuarioId: string): Promise<RespostaUsuarioDto>

// Atualiza nome do usuário logado
atualizarEu(usuarioId: string, dto: AtualizarEuDto): Promise<RespostaUsuarioDto>

// Troca senha validando a senha atual
alterarSenha(usuarioId: string, dto: AlterarSenhaDto): Promise<void>

// Troca PIN validando a senha atual
alterarPin(usuarioId: string, dto: AlterarPinDto): Promise<void>

// [PRIVADO] Valida CPF com dígitos verificadores
private validarCpf(cpf: string): boolean

// [PRIVADO] Verifica se CPF já existe
private cpfExiste(cpf: string): Promise<boolean>

// [PRIVADO] Verifica se cadastros estão habilitados nas configurações
private cadastrosHabilitados(): Promise<boolean>
```

### DTOs

```typescript
// login.dto.ts
export class LoginDto {
  @IsString() @Length(11, 11)
  cpf: string;

  @IsString() @Length(6, 6)
  senha: string;

  @IsString() @Length(4, 4)
  @IsNumberString()
  pin: string;
}

// cadastro.dto.ts
export class CadastroDto {
  @IsString() @Matches(/^[A-Za-zÀ-ÿ\s]+$/) @MinLength(3)
  nome: string;

  @IsString() @Length(11, 11) @IsNumberString()
  cpf: string;

  @IsString() @Length(6, 6) @IsAlphanumeric()
  senha: string;

  @IsString() @Length(4, 4) @IsNumberString()
  pin: string;
}
```

### `jwt.strategy.ts`

```typescript
// Payload: { sub: usuarioId, cpf, isAdmin }
// Valida token e injeta usuário via @UsuarioAtual()
```

---

## Módulo de Usuários

### Endpoints (todos exigem `isAdmin: true`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/usuarios` | Listar todos os responsáveis |
| `GET` | `/usuarios/estatisticas` | Contadores: total, ativos, inativos, dependentes |
| `GET` | `/usuarios/:id` | Detalhe do responsável |
| `GET` | `/usuarios/:id/dependentes` | Dependentes do responsável |
| `GET` | `/usuarios/:id/agendamentos` | Agendamentos do responsável |
| `PATCH` | `/usuarios/:id` | Editar nome do responsável |
| `PATCH` | `/usuarios/:id/status` | Ativar ou inativar conta |
| `PATCH` | `/usuarios/:id/redefinir-pin` | Gerar novo PIN aleatório |
| `DELETE` | `/usuarios/:id` | Deletar responsável (cascade) |

### `usuarios.service.ts` — Métodos

```typescript
// Lista todos com paginação e busca por nome/CPF
buscarTodos(query: { busca?: string; status?: string; pagina: number; limite: number }): Promise<ResultadoPaginado<Usuario>>

// Contadores para o painel admin
buscarEstatisticas(): Promise<EstatisticasUsuarioDto>

// Retorna usuário por id, lança 404 se não existir
buscarUm(id: string): Promise<Usuario>

// Lista dependentes de um responsável específico
buscarDependentes(usuarioId: string): Promise<Dependente[]>

// Lista agendamentos de um responsável específico
buscarAgendamentos(usuarioId: string): Promise<Agendamento[]>

// Atualiza nome do responsável
atualizar(id: string, dto: AtualizarUsuarioDto): Promise<Usuario>

// Alterna status ativo/inativo, registra log
alternarStatus(id: string, requisitanteId: string, ip: string): Promise<Usuario>

// Gera PIN de 4 dígitos, aplica hash, salva e retorna PIN em texto simples
redefinirPin(id: string, requisitanteId: string, ip: string): Promise<{ novoPin: string }>

// Remove responsável e todos seus dependentes/agendamentos por cascade
remover(id: string): Promise<void>
```

### DTOs

```typescript
// atualizar-usuario.dto.ts
export class AtualizarUsuarioDto {
  @IsOptional() @IsString() @Matches(/^[A-Za-zÀ-ÿ\s]+$/) @MinLength(3)
  nome?: string;
}

// atualizar-status.dto.ts
export class AtualizarStatusDto {
  @IsIn(['ativo', 'inativo'])
  status: 'ativo' | 'inativo';
}
```

---

## Módulo de Dependentes

### Endpoints

| Método | Rota | Guarda | Descrição |
|--------|------|--------|-----------|
| `GET` | `/dependentes` | JWT | Dependentes do usuário logado (admin vê todos) |
| `POST` | `/dependentes` | JWT | Criar dependente para o usuário logado |
| `GET` | `/dependentes/:id` | JWT | Detalhe (dono ou admin) |
| `PATCH` | `/dependentes/:id` | JWT | Editar (dono ou admin) |
| `DELETE` | `/dependentes/:id` | JWT | Deletar (dono ou admin) |

### `dependentes.service.ts` — Métodos

```typescript
// Admin recebe todos; usuário normal recebe só os seus
buscarTodos(requisitanteId: string, isAdmin: boolean): Promise<Dependente[]>

// Cria dependente vinculado ao usuarioId
// Valida: CPF único, limite de dependentes das configurações, formato de CPF
criar(usuarioId: string, dto: CriarDependenteDto): Promise<Dependente>

// Retorna dependente; valida se requisitante é dono ou admin
buscarUm(id: string, requisitanteId: string, isAdmin: boolean): Promise<Dependente>

// Atualiza nome e/ou CPF do dependente
atualizar(id: string, dto: AtualizarDependenteDto, requisitanteId: string, isAdmin: boolean): Promise<Dependente>

// Remove dependente e seta dependenteId como null nos agendamentos associados
remover(id: string, requisitanteId: string, isAdmin: boolean): Promise<void>

// [PRIVADO] Verifica se requisitante tem acesso ao dependente
private verificarPropriedade(dependente: Dependente, requisitanteId: string, isAdmin: boolean): void
```

### DTOs

```typescript
// criar-dependente.dto.ts
export class CriarDependenteDto {
  @IsString() @Matches(/^[A-Za-zÀ-ÿ\s]+$/) @MinLength(3)
  nome: string;

  @IsString() @Length(11, 11) @IsNumberString()
  cpf: string;
}

// atualizar-dependente.dto.ts
export class AtualizarDependenteDto {
  @IsOptional() @IsString() @Matches(/^[A-Za-zÀ-ÿ\s]+$/) @MinLength(3)
  nome?: string;

  @IsOptional() @IsString() @Length(11, 11) @IsNumberString()
  cpf?: string;
}
```

---

## Módulo de Agendamentos

### Endpoints

| Método | Rota | Guarda | Descrição |
|--------|------|--------|-----------|
| `GET` | `/agendamentos` | JWT | Agendamentos do usuário logado (admin vê todos) |
| `GET` | `/agendamentos/calendario` | JWT | Agendamentos agrupados por data para o calendário |
| `GET` | `/agendamentos/:id` | JWT | Detalhe do agendamento (dono ou admin) |
| `POST` | `/agendamentos` | JWT | Criar agendamento |
| `PATCH` | `/agendamentos/:id` | JWT | Editar agendamento (dono ou admin) |
| `DELETE` | `/agendamentos/:id` | JWT | Cancelar agendamento (dono ou admin) |

**Query params para `GET /agendamentos`:**
- `mes` (1-12) + `ano` (YYYY) → filtra por mês
- `dependenteId` → filtra por dependente
- `especialidadeId` → filtra por especialidade
- `localizacaoId` → filtra por local
- `pagina` + `limite` → paginação

**Query params para `GET /agendamentos/calendario`:**
- `mes` (obrigatório)
- `ano` (obrigatório)

### `agendamentos.service.ts` — Métodos

```typescript
// Lista agendamentos com filtros; admin vê todos, usuário vê os seus
buscarTodos(
  requisitanteId: string,
  isAdmin: boolean,
  filtros: FiltrosAgendamentoDto
): Promise<ResultadoPaginado<Agendamento>>

// Retorna array de datas { data: 'YYYY-MM-DD', quantidade: number } para destacar no calendário
buscarDadosCalendario(
  requisitanteId: string,
  isAdmin: boolean,
  mes: number,
  ano: number
): Promise<DiaCalendario[]>

// Retorna agendamento com validação de propriedade
buscarUm(id: string, requisitanteId: string, isAdmin: boolean): Promise<Agendamento>

// Cria agendamento
// Valida: data não no passado, horário disponível para o paciente, especialidade/localização existem
criar(usuarioId: string, dto: CriarAgendamentoDto): Promise<Agendamento>

// Atualiza data, horário, especialidade ou localização de um agendamento
atualizar(
  id: string,
  dto: AtualizarAgendamentoDto,
  requisitanteId: string,
  isAdmin: boolean
): Promise<Agendamento>

// Cancela agendamento
remover(id: string, requisitanteId: string, isAdmin: boolean): Promise<void>

// [PRIVADO] Verifica se paciente já tem agendamento no mesmo dia/horário
private verificarConflito(pacienteId: string, data: string, horario: string, excluirId?: string): Promise<void>

// [PRIVADO] Resolve nome snapshot do paciente (responsável ou dependente)
private resolverNomePaciente(usuarioId: string, dependenteId?: string): Promise<string>
```

### DTOs

```typescript
// criar-agendamento.dto.ts
export class CriarAgendamentoDto {
  @IsDateString()
  data: string;  // YYYY-MM-DD

  @IsString() @Matches(/^\d{2}:\d{2}$/)
  horario: string;  // HH:mm

  @IsUUID()
  especialidadeId: string;

  @IsUUID()
  localizacaoId: string;

  // Se null, o paciente é o próprio responsável
  @IsOptional() @IsUUID()
  dependenteId?: string;
}

// atualizar-agendamento.dto.ts
export class AtualizarAgendamentoDto {
  @IsOptional() @IsDateString()
  data?: string;

  @IsOptional() @IsString() @Matches(/^\d{2}:\d{2}$/)
  horario?: string;

  @IsOptional() @IsUUID()
  especialidadeId?: string;

  @IsOptional() @IsUUID()
  localizacaoId?: string;
}
```

---

## Módulo de Especialidades

### Endpoints

| Método | Rota | Guarda | Descrição |
|--------|------|--------|-----------|
| `GET` | `/especialidades` | JWT | Listar especialidades ativas |
| `GET` | `/especialidades/todas` | Admin | Listar todas (incluindo inativas) |
| `POST` | `/especialidades` | Admin | Criar especialidade |
| `PATCH` | `/especialidades/:id` | Admin | Editar nome ou status |
| `DELETE` | `/especialidades/:id` | Admin | Deletar (bloqueia se tiver agendamentos vinculados) |

### `especialidades.service.ts` — Métodos

```typescript
// Retorna especialidades ativas (para selects do usuário)
buscarAtivas(): Promise<Especialidade[]>

// Retorna todas (admin)
buscarTodas(): Promise<Especialidade[]>

// Cria nova especialidade, valida nome único
criar(dto: CriarEspecialidadeDto): Promise<Especialidade>

// Edita nome ou ativa/desativa
atualizar(id: string, dto: AtualizarEspecialidadeDto): Promise<Especialidade>

// Deleta apenas se não tiver agendamentos associados
remover(id: string): Promise<void>
```

### DTOs

```typescript
// criar-especialidade.dto.ts
export class CriarEspecialidadeDto {
  @IsString() @MinLength(3) @MaxLength(100)
  nome: string;
}

// atualizar-especialidade.dto.ts
export class AtualizarEspecialidadeDto {
  @IsOptional() @IsString() @MinLength(3) @MaxLength(100)
  nome?: string;

  @IsOptional() @IsBoolean()
  ativo?: boolean;
}
```

---

## Módulo de Localizações

### Endpoints

| Método | Rota | Guarda | Descrição |
|--------|------|--------|-----------|
| `GET` | `/localizacoes` | JWT | Listar localizações ativas |
| `GET` | `/localizacoes/todas` | Admin | Listar todas (incluindo inativas) |
| `POST` | `/localizacoes` | Admin | Criar localização |
| `PATCH` | `/localizacoes/:id` | Admin | Editar localização |
| `DELETE` | `/localizacoes/:id` | Admin | Deletar (bloqueia se tiver agendamentos vinculados) |

### `localizacoes.service.ts` — Métodos

```typescript
// Retorna localizações ativas (para selects do usuário)
buscarAtivas(): Promise<Localizacao[]>

// Retorna todas (admin)
buscarTodas(): Promise<Localizacao[]>

// Cria nova localização, valida unicidade do nome
criar(dto: CriarLocalizacaoDto): Promise<Localizacao>

// Edita nome, cidade, estado ou ativa/desativa
atualizar(id: string, dto: AtualizarLocalizacaoDto): Promise<Localizacao>

// Deleta apenas se não tiver agendamentos associados
remover(id: string): Promise<void>
```

### DTOs

```typescript
// criar-localizacao.dto.ts
export class CriarLocalizacaoDto {
  @IsString() @MinLength(3)
  nome: string;  // "São Paulo SP"

  @IsString() @MinLength(2)
  cidade: string;

  @IsString() @Length(2, 2)
  estado: string;
}

// atualizar-localizacao.dto.ts
export class AtualizarLocalizacaoDto {
  @IsOptional() @IsString() @MinLength(3)
  nome?: string;

  @IsOptional() @IsString() @MinLength(2)
  cidade?: string;

  @IsOptional() @IsString() @Length(2, 2)
  estado?: string;

  @IsOptional() @IsBoolean()
  ativo?: boolean;
}
```

---

## Módulo de Logs

### Endpoints (todos Admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/logs` | Listar logs com filtros e paginação |
| `GET` | `/logs/estatisticas` | Contadores por tipo de evento |

**Query params para `GET /logs`:**
- `tipo` → filtrar por tipo de evento
- `usuarioId` → filtrar por usuário
- `cpf` → filtrar por CPF
- `de` / `ate` → intervalo de datas (ISO)
- `pagina` + `limite`

### `logs.service.ts` — Métodos

```typescript
// Lista logs com filtros; paginado
buscarTodos(filtros: FiltrosLogDto): Promise<ResultadoPaginado<Log>>

// Contadores por tipo para o painel
buscarEstatisticas(dias?: number): Promise<EstatisticasLogDto>

// [USADO INTERNAMENTE pelos outros serviços] Registra evento no banco
registrar(dados: {
  tipo: TipoLog;
  usuarioId?: string;
  cpfUsuario?: string;
  enderecoIp?: string;
  detalhes?: string;
}): Promise<void>
```

> `logs.service.ts` é injetado pelos demais módulos (Autenticação, Usuários, Agendamentos, Dependentes) para registrar eventos automaticamente.

---

## Módulo de Configurações

### Endpoints (todos Admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/configuracoes` | Retorna configurações atuais |
| `PATCH` | `/configuracoes` | Atualiza uma ou mais configurações |

### `configuracoes.service.ts` — Métodos

```typescript
// Retorna registro singleton (cria com padrões se não existir)
buscarConfiguracoes(): Promise<ConfiguracoesSistema>

// Atualiza campos parcialmente
atualizar(dto: AtualizarConfiguracoesDto): Promise<ConfiguracoesSistema>

// [USADO INTERNAMENTE] Retorna valor de uma chave específica
buscarValor<K extends keyof ConfiguracoesSistema>(chave: K): Promise<ConfiguracoesSistema[K]>
```

### DTOs

```typescript
// atualizar-configuracoes.dto.ts
export class AtualizarConfiguracoesDto {
  @IsOptional() @IsString() @MinLength(3)
  nomeSistema?: string;

  @IsOptional() @IsBoolean()
  modoManutencao?: boolean;

  @IsOptional() @IsBoolean()
  permitirCadastros?: boolean;

  @IsOptional() @IsInt() @Min(1) @Max(10)
  limiteDependentes?: number;

  @IsOptional() @IsInt() @Min(5) @Max(120)
  tempoSessao?: number;

  @IsOptional() @IsBoolean()
  habilitarLogsSeguranca?: boolean;

  @IsOptional() @IsBoolean()
  exigirSenhaForte?: boolean;

  @IsOptional() @IsBoolean()
  habilitarNotificacoesEmail?: boolean;

  @IsOptional() @IsEmail()
  emailNotificacao?: string;
}
```

---

## Módulo do Painel

### Endpoints (todos Admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/painel/estatisticas` | Contadores principais para o painel |
| `GET` | `/painel/grafico` | Dados de agendamentos para o gráfico |

### `painel.service.ts` — Métodos

```typescript
// Retorna contadores consolidados
buscarEstatisticas(): Promise<{
  totalUsuarios: number;
  totalDependentes: number;
  agendamentosNoMes: number;
  usuariosAtivos: number;
  usuariosInativos: number;
  agendamentosHoje: number;
  alertasSistema: number;  // ex: usuários bloqueados + modo manutenção
}>

// Retorna agendamentos dos últimos N dias para o gráfico de barras
buscarGraficoAgendamentos(dias?: number): Promise<Array<{
  data: string;    // YYYY-MM-DD
  rotulo: string;  // "Seg", "Ter", etc.
  quantidade: number;
}>>
```

---

## Guardas e Decoradores

### `jwt-autenticacao.guard.ts`
Estende `AuthGuard('jwt')` do Passport. Aplicado globalmente via `APP_GUARD` no `AppModule`.
Rotas públicas são marcadas com `@Publico()`.

### `papeis.guard.ts`
Verifica se `request.usuario.isAdmin === true` quando a rota é marcada com `@Papeis('admin')`.

### `usuario-atual.decorator.ts`
```typescript
// Injeta o payload decodificado do JWT
export const UsuarioAtual = createParamDecorator(
  (data, ctx) => ctx.switchToHttp().getRequest().user
);
```

### `papeis.decorator.ts`
```typescript
// Marca rota como somente admin
export const Papeis = (...papeis: string[]) => SetMetadata('papeis', papeis);

// Marca rota como pública (sem JWT)
export const Publico = () => SetMetadata('isPublico', true);
```

---

## Seed Inicial

Ao subir a aplicação pela primeira vez, um `OnApplicationBootstrap` no `AppModule` executa:

1. Criar usuário admin com CPF do `.env`, senha e PIN com hash bcrypt
2. Popular `especialidades` com as 16 especialidades padrão
3. Popular `localizacoes` com as 15 cidades padrão
4. Criar registro singleton de `ConfiguracoesSistema` com valores padrão

---

## Fluxo de Autenticação

```
POST /auth/login
  → Busca usuário por CPF
  → Verifica status !== 'inativo'  (HTTP 403 se bloqueado)
  → bcrypt.compare(senha, usuario.senha)
  → bcrypt.compare(pin, usuario.pin)
  → Registra log 'login' (ou 'login_falhou' em caso de falha)
  → Retorna JWT { sub, cpf, isAdmin }

POST /auth/cadastro
  → Verifica configuracoes.permitirCadastros
  → Valida CPF (algoritmo dígito verificador)
  → Verifica unicidade do CPF
  → Valida nome, senha, PIN
  → Hash de senha e PIN com bcrypt
  → Salva Usuário
  → Registra log 'usuario_criado'
  → Retorna JWT + dados do usuário
```

---

## Padrão de Resposta

Todos os endpoints retornam JSON seguindo o padrão:

```typescript
// Sucesso com dados
{
  "dados": { ... }  // ou [ ... ]
}

// Sucesso paginado
{
  "dados": [ ... ],
  "meta": {
    "total": 100,
    "pagina": 1,
    "limite": 20,
    "totalPaginas": 5
  }
}

// Erro
{
  "statusCode": 400,
  "mensagem": "CPF já cadastrado",
  "erro": "Bad Request"
}
```

---

## Dependências do Projeto

```json
{
  "dependencies": {
    "@nestjs/common": "^10",
    "@nestjs/core": "^10",
    "@nestjs/platform-express": "^10",
    "@nestjs/jwt": "^10",
    "@nestjs/passport": "^10",
    "@nestjs/typeorm": "^10",
    "@nestjs/config": "^3",
    "passport": "^0.7",
    "passport-jwt": "^4",
    "typeorm": "^0.3",
    "better-sqlite3": "^9",
    "bcrypt": "^5",
    "class-validator": "^0.14",
    "class-transformer": "^0.5",
    "reflect-metadata": "^0.2",
    "rxjs": "^7"
  },
  "devDependencies": {
    "@nestjs/cli": "^10",
    "@nestjs/testing": "^10",
    "@types/bcrypt": "^5",
    "@types/better-sqlite3": "^7",
    "@types/passport-jwt": "^4",
    "typescript": "^5"
  }
}
```

---

## Mapeamento Frontend → Backend

| Operação no Frontend | Endpoint Backend |
|----------------------|-----------------|
| Login | `POST /auth/login` |
| Cadastro | `POST /auth/cadastro` |
| Logout | `POST /auth/logout` |
| Painel — carregar agendamentos do mês | `GET /agendamentos/calendario?mes=&ano=` |
| Painel — abrir modal de data | `GET /agendamentos?mes=&ano=` |
| Criar agendamento | `POST /agendamentos` |
| Editar agendamento | `PATCH /agendamentos/:id` |
| Cancelar agendamento | `DELETE /agendamentos/:id` |
| Listar especialidades (select) | `GET /especialidades` |
| Listar localizações (select) | `GET /localizacoes` |
| Listar dependentes (select) | `GET /dependentes` |
| Criar dependente | `POST /dependentes` |
| Deletar dependente | `DELETE /dependentes/:id` |
| Admin — estatísticas | `GET /painel/estatisticas` |
| Admin — gráfico | `GET /painel/grafico` |
| Admin — listar usuários | `GET /usuarios?busca=&status=&pagina=&limite=` |
| Admin — estatísticas de usuários | `GET /usuarios/estatisticas` |
| Admin — bloquear/desbloquear | `PATCH /usuarios/:id/status` |
| Admin — redefinir PIN | `PATCH /usuarios/:id/redefinir-pin` |
| Admin — editar usuário | `PATCH /usuarios/:id` |
| Admin — listar logs | `GET /logs?tipo=&de=&ate=&pagina=&limite=` |
| Admin — estatísticas de logs | `GET /logs/estatisticas` |
| Admin — configurações | `GET /configuracoes` / `PATCH /configuracoes` |
| Admin — especialidades CRUD | `GET/POST/PATCH/DELETE /especialidades` |
| Admin — localizações CRUD | `GET/POST/PATCH/DELETE /localizacoes` |
