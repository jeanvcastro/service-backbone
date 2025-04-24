# service-backbone

> Backend service backbone designed to bootstrap microservices with a clear and scalable structure.

Este projeto fornece uma base sólida e opinativa para construção de microserviços em Node.js, aplicando princípios como **Clean Architecture**, **Domain-Driven Design (DDD)** e **injeção de dependência**.

Embora inclua implementações com tecnologias como **RabbitMQ**, **Knex**, **Express**, **SES**, entre outras, elas são apenas exemplos funcionais. A arquitetura foi pensada para ser desacoplada e substituível, permitindo adaptar ou trocar ferramentas com mínimo impacto nas camadas de domínio e caso de uso.

---

## ✨ Features

- Estrutura modular por contexto (web, CLI, eventbus, schedule)
- Clean Architecture com separação clara entre camadas
- Casos de uso isolados e testáveis
- Injeção de dependência baseada em container por request
- Integração com RabbitMQ para eventos assíncronos
- Jobs agendados com `node-schedule`
- CLI funcional com `yargs`
- Templates de e-mail com Handlebars + AWS SES
- Migrations e seeds com `Knex.js`
- Lint, Prettier, TypeScript, Husky e Vitest
- Build otimizado com `esbuild` para múltiplos entrypoints

---

## 📁 Project Structure

A estrutura do projeto segue os princípios de **modularidade**, **alta coesão** e **separação de responsabilidades**. Cada pasta tem um papel bem definido dentro da arquitetura, refletindo os fundamentos da **Clean Architecture** na organização por **feature e responsabilidade**.

```
src/
├── domain/        # Regras de negócio (entidades, objetos de valor, eventos)
├── useCases/      # Casos de uso organizados por funcionalidade
├── infra/         # Implementações externas (HTTP, CLI, DB, EventBus, etc.)
├── shared/        # Núcleo técnico reutilizável (DI, UoW, EventBus, etc.)
├── tests/         # Mocks e fábricas para testes unitários
├── dist/          # Código transpilado e empacotado para produção
```

A pasta `useCases/` segue o padrão **package by feature**, onde cada caso de uso contém todos os arquivos necessários para funcionar de forma independente, conforme o tipo de entrada esperada:

- `SyncProducts/`: acionado via **CLI**, possui um `SyncProductsCommand.ts`
- `CreateOrder/`: exposto via **HTTP (Express)**, possui um `CreateOrderController.ts`
- `SendOrderNotification/`: reagente a **eventos**, possui um `SendOrderNotificationEventHandler.ts`

Cada use case pode conter tanto lógica de aplicação (como validações e DTOs) quanto uma camada de infraestrutura específica para seu canal de entrada (como controllers, comandos ou handlers), respeitando a estrutura modular e coesa.

> Além dos entrypoints padrão (`web`, `cli`, `schedule`, `eventbus`), o projeto está preparado para ser estendido com novos pontos de entrada, como um `lambda`, `worker`, `graphql`, ou qualquer outro formato necessário. A arquitetura modular facilita essa expansão com mínimo esforço.

---

## 🧩 Dependency Injection por Caso de Uso

O projeto adota uma abordagem de **injeção de dependência por caso de uso**, mantendo o controle de instâncias e resoluções totalmente localizadas.

Cada `useCase/` possui seu próprio `di.ts`, onde as dependências são registradas explicitamente:

```ts
// src/useCases/createOrder/di.ts

container.add("OrdersRepository", ({ knexConnection }) => new KnexOrdersRepository(knexConnection));

container.add("CreateOrderUseCase", ({ OrdersRepository, EventBus, UnitOfWork }) =>
  new CreateOrderUseCase(OrdersRepository, ..., UnitOfWork, EventBus)
);

container.add("CreateOrderController", ({ CreateOrderUseCase, ErrorHandler }) =>
  new CreateOrderController(CreateOrderUseCase, ErrorHandler)
);
```

### ✅ Vantagens

- **Desacoplado**: não depende de framework externo de DI
- **Isolado**: cada use case pode ter infraestrutura própria
- **Testável**: fácil substituir implementações por mocks
- **Bundle-friendly**: sem resoluções dinâmicas globais que quebram o `esbuild`

> A DI é resolvida no entrypoint da rota (HTTP), comando (CLI) ou evento, garantindo que cada request tenha seu próprio escopo de injeção.

---

## ✅ Validação Declarativa com Zod

Cada caso de uso define seu contrato de entrada (`Input.ts`) como tipo TypeScript explícito, e valida os dados recebidos com `zod`. A consistência entre o tipo e o schema é garantida com `satisfies`, um recurso do TypeScript 4.9+.

Exemplo:

```ts
// CreateOrderInput.ts
export interface CreateOrderInput {
  customerUuid: string;
  productUuids: string[];
  status: "APPROVED" | "REJECTED";
  value: number;
  // ...
}

// CreateOrderInputValidator.ts
import { z } from "zod";
import type { CreateOrderInput } from "./CreateOrderInput";

export const CreateOrderInputValidator = z.object({
  customerUuid: z.string().uuid(),
  productUuids: z.array(z.string().uuid()).min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
  value: z.number().min(500)
  // ...
}) satisfies z.ZodType<CreateOrderInput>;
```

### 🔒 Benefícios

- O tipo `CreateOrderInput` é a **fonte da verdade** para o caso de uso
- O schema Zod garante que **os dados de entrada sejam válidos**
- `satisfies` previne inconsistência entre validação e contrato
- O mesmo schema pode ser reutilizado em qualquer entrada: **HTTP, CLI, eventos**
- Nenhuma dependência do Zod vaza para o domínio

---

## 🚀 Getting Started

### 📦 Prerequisites

Certifique-se de ter os seguintes requisitos instalados na sua máquina:

- [Node.js 22.x](https://nodejs.org/)
- [PNPM](https://pnpm.io/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) para rodar serviços como banco de dados e fila

---

### 🛠 Installation

Clone o repositório e instale as dependências com PNPM:

```bash
git clone https://github.com/jeanvcastro/service-backbone.git
cd service-backbone
pnpm install
```

---

### ⚙️ Environment Variables

Copie o arquivo `.env.example` para `.env` e configure de acordo com seu ambiente:

```bash
cp .env.example .env
```

Exemplo de variáveis:

```
DATABASE_URL=postgresql://user:password@localhost:5432/backbone
RABBITMQ_URL=amqp://localhost
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=...
AWS_SES_SECRET_ACCESS_KEY=...
```

---

### ▶️ Running in Development

Você pode iniciar qualquer um dos contextos de forma independente:

- Web (Express):

  ```bash
  pnpm dev
  ```

- CLI:

  ```bash
  pnpm dev:cli
  ```

- Schedule (jobs agendados):

  ```bash
  pnpm dev:schedule
  ```

- Event Bus (eventos assíncronos):
  ```bash
  pnpm dev:eventbus
  ```

---

### 🏗 Building for Production

Para compilar o projeto com `esbuild`:

```bash
pnpm build
# ou compilar por contexto:
pnpm build:web
pnpm build:cli
pnpm build:schedule
pnpm build:eventbus
```

---

### ▶️ Running the Build

```bash
pnpm start           # Web (Express)
pnpm start:cli       # CLI
pnpm start:schedule  # Jobs agendados
pnpm start:eventbus  # Escuta de eventos
```

---

## 🧱 Available Commands

Scripts disponíveis via `pnpm`:

### 🔄 Desenvolvimento

| Comando             | Descrição                                  |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Inicia o servidor Express (HTTP)           |
| `pnpm dev:cli`      | Executa comandos da CLI                    |
| `pnpm dev:schedule` | Inicia os jobs agendados (`node-schedule`) |
| `pnpm dev:eventbus` | Inicia os listeners de eventos RabbitMQ    |

---

### ⚙️ Build

| Comando               | Descrição                                  |
| --------------------- | ------------------------------------------ |
| `pnpm build`          | Compila todos os entrypoints com `esbuild` |
| `pnpm build:web`      | Compila somente o contexto web             |
| `pnpm build:cli`      | Compila apenas a CLI                       |
| `pnpm build:schedule` | Compila apenas os jobs agendados           |
| `pnpm build:eventbus` | Compila apenas os consumidores de eventos  |

---

### 🚀 Execução da Build

| Comando               | Descrição                                    |
| --------------------- | -------------------------------------------- |
| `pnpm start`          | Executa o servidor Express (dist/web/app.js) |
| `pnpm start:cli`      | Executa a CLI compilada                      |
| `pnpm start:schedule` | Executa os jobs agendados compilados         |
| `pnpm start:eventbus` | Executa os event listeners compilados        |

---

### 🧹 Código

| Comando          | Descrição                           |
| ---------------- | ----------------------------------- |
| `pnpm lint`      | Roda o ESLint                       |
| `pnpm lint:fix`  | Corrige problemas automaticamente   |
| `pnpm format`    | Aplica formatação com Prettier      |
| `pnpm typecheck` | Verificação de tipos com TypeScript |

---

### 🧪 Banco de Dados (Knex.js)

| Comando                  | Descrição                             |
| ------------------------ | ------------------------------------- |
| `pnpm db:make:migration` | Cria uma nova migration               |
| `pnpm db:make:seed`      | Cria um novo arquivo de seed          |
| `pnpm db:migrate`        | Executa todas as migrations pendentes |
| `pnpm db:seed`           | Executa os seeds                      |
| `pnpm db:status`         | Mostra o status das migrations        |

---

### 🧪 Testes

| Comando     | Descrição                    |
| ----------- | ---------------------------- |
| `pnpm test` | Executa os testes com Vitest |

---

## 🧰 Tooling and Dev Experience

A experiência de desenvolvimento foi pensada para ser fluida, rápida e segura. A base já vem preparada com ferramentas modernas para garantir qualidade de código e produtividade desde o primeiro commit.

---

### 🔄 Hot Reload com `tsx`

Durante o desenvolvimento, o projeto utiliza [`tsx`](https://github.com/esbuild-kit/tsx) para rodar arquivos TypeScript diretamente com suporte a **hot reload**:

```bash
pnpm dev           # Web (Express)
pnpm dev:cli       # CLI
pnpm dev:schedule  # Jobs agendados
pnpm dev:eventbus  # Event listeners
```

---

### 🔧 Lint e Format

- ESLint com presets da comunidade e integração com TypeScript
- Prettier para formatação consistente
- Comandos disponíveis:

```bash
pnpm lint        # Verifica problemas
pnpm lint:fix    # Corrige automaticamente
pnpm format      # Aplica Prettier
```

---

### 🧪 Type Checking

- Verificação estática com TypeScript sem gerar arquivos:

```bash
pnpm typecheck
```

---

### ✅ Pré-commit com Husky

Para evitar que problemas de lint ou formatação cheguem no repositório:

- `husky` + `lint-staged` já configurados
- Executa automaticamente lint e format antes de cada commit

---

### 🧱 Build Modular com esbuild

O projeto suporta múltiplos entrypoints (`web`, `cli`, `eventbus`, `schedule`) com builds otimizados, rápidos e separados. Tudo pronto para CI/CD.

```bash
pnpm build
```

---

## 🛠 Technologies Used

Este projeto utiliza uma série de tecnologias modernas para fornecer **implementações funcionais**, mas nenhuma delas é obrigatória. A arquitetura foi pensada para ser **desacoplada e facilmente substituível**, permitindo adaptar o projeto às necessidades específicas de qualquer time ou stack.

**Importante:** _este projeto **não é um framework**, mas sim um esqueleto modular para microserviços baseado em Clean Architecture_.

---

### 🔧 Core

- **Node.js 22.x** – Runtime moderno com suporte a ES Modules
- **TypeScript** – Tipagem estática e produtividade
- **esbuild** – Build ultrarrápido e enxuto por contexto

### 🌐 Web

- **Express 5** – Exemplo de implementação HTTP com rotas e middleware
- **helmet / compression / cors** – Segurança e performance

### 🐇 Event-driven

- **amqplib + RabbitMQ** – Exemplo funcional de event bus assíncrono

### 🕒 Scheduled Jobs

- **node-schedule** – Implementação funcional para agendamento de tarefas

### 📦 CLI

- **yargs** – Entrada de comandos via terminal como `syncProducts`

### 📊 Database

- **Knex.js** – Query builder com migrations e seeds
- **PostgreSQL** – Banco de dados relacional (pode ser trocado por outro)

### ✉️ Email

- **AWS SES** – Envio de e-mails (pode ser substituído por qualquer SMTP)
- **Handlebars** – Templates dinâmicos para e-mail

### 🧪 Testes

- **Vitest** – Testes unitários com DX moderna
- **@faker-js/faker** – Dados fake para factories

### 🧼 Qualidade de Código

- **ESLint + Prettier** – Lint e formatação padronizada
- **Husky + lint-staged** – Ganchos de pré-commit para garantir qualidade

---

## 🗃️ Database

Este projeto utiliza **Knex.js** como implementação funcional para acesso a banco de dados, migrations e seeds. Essa escolha visa simplicidade, performance e controle total sobre o SQL gerado.

> **Importante:** esta implementação com Knex é apenas um exemplo funcional. Pode ser facilmente substituída por outro ORM ou query builder (como Prisma, MikroORM, etc.), sem afetar as camadas de domínio ou casos de uso.

---

### 📦 Migrations

As migrations ficam em:

```
src/infra/db/knex/migrations/
```

Crie uma nova migration com:

```bash
pnpm db:make:migration nome_da_migration
```

Rode todas as migrations pendentes com:

```bash
pnpm db:migrate
```

---

### 🌱 Seeds

Seeds de dados de exemplo ficam em:

```
src/infra/db/knex/seeds/
```

Crie um novo seed com:

```bash
pnpm db:make:seed nome_do_seed
```

Execute os seeds com:

```bash
pnpm db:seed
```

---

### 📊 Conexão

A conexão com o banco de dados é configurada via `DATABASE_URL` no `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/backbone
```

---

### 🔄 Unit of Work

O projeto implementa um padrão de **Unit of Work** para garantir consistência em operações transacionais.

A responsabilidade pela transação **fica na camada de aplicação (use case)**, o que permite que a lógica de negócio continue desacoplada de qualquer tecnologia de persistência.

Exemplo real do uso:

```ts
await this.unityOfWork.start(async transactionContext => {
  await this.ordersRepository.create(order, products, transactionContext);

  for (const product of products) {
    await this.productsRepository.incrementOrdersCount(product.uuid, transactionContext);
  }
});
```

Esse padrão permite manter **as regras de negócio puras e isoladas**, enquanto as transações são orquestradas de forma explícita e segura.

---

## 🐳 Docker

O projeto possui suporte completo a containers via **Docker** e **Docker Compose**, com serviços separados para banco de dados, fila de mensagens e múltiplos contextos de aplicação (web, agendador e consumidor de eventos).

---

### 🧱 Serviços

```yaml
services:
  db          # PostgreSQL 16 com volume persistente
  rabbitmq    # RabbitMQ com interface de gerenciamento ativada
  migrations  # Roda as migrations do Knex e finaliza
  app         # Executa o servidor HTTP (Express)
  schedule    # Executa jobs agendados
  eventbus    # Escuta e processa eventos da fila
```

> Os serviços `app`, `schedule` e `eventbus` estão sob o perfil `runtime`, o que permite subir só quando necessário com:

```bash
docker compose --profile runtime up --build
```

---

### 🧪 Migrations como Etapa do Pipeline

A imagem `migrations` é executada automaticamente antes dos serviços de runtime, garantindo que o banco esteja sempre atualizado antes da aplicação iniciar.

```yaml
migrations:
  depends_on:
    db:
      condition: service_healthy
```

---

### 🐳 Dockerfile Multi-Stage

O `Dockerfile` foi organizado em múltiplos estágios para otimizar cache, reduzir imagem final e isolar responsabilidades:

- `base`: prepara o ambiente com Node.js e PNPM
- `builder`: instala dependências, compila o código
- `migrations`: executa apenas as migrations
- `prod_deps`: instala só as dependências de produção
- `production`: imagem final leve, contendo apenas `node_modules`, `dist` e `package.json`

---

### 📦 Subindo tudo com banco e fila:

```bash
docker compose up --build
```

Somente runtime:

```bash
docker compose --profile runtime up --build
```

---

## 📦 CLI (Command Line Interface)

O projeto possui suporte a execução de comandos via terminal usando [`yargs`](https://github.com/yargs/yargs), com um design baseado em **package by feature**. Cada comando é autônomo e registrado de forma manual, garantindo clareza e controle no bundle final.

---

### 🧱 Estrutura de um Comando

Cada comando possui seu próprio arquivo com a assinatura esperada pelo `yargs`:

```ts
// src/useCases/syncProducts/SyncProductsCommand.ts

export const command = "sync-products";
export const describe = "Sync products from external source";
export const builder = {};
export const handler = async () => {
  const container = configureDI();
  const useCase = container.get("SyncProductsUseCase");
  await useCase.execute({ products: [...] });
};
```

---

### 📥 Registro dos Comandos

Todos os comandos são registrados manualmente no entrypoint da CLI:

```ts
// src/infra/cli/entrypoint.ts

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as syncProducts from "@/useCases/syncProducts/SyncProductsCommand";

// Register commands
const commands = [syncProducts];

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
  .scriptName("cli")
  .command(commands as any)
  .demandCommand()
  .strict()
  .help().argv;
```

> O registro manual evita uso de `require` dinâmico, o que garante compatibilidade com `esbuild` e permite total controle sobre o que será incluído no bundle final.

---

### ▶️ Execução

**Em desenvolvimento:**

```bash
pnpm dev:cli sync-products
```

**Após build:**

```bash
pnpm build:cli
node dist/cli/app.js sync-products
```

---

### 🧩 Modular e Substituível

Assim como todo o restante da arquitetura, a CLI foi desenhada para ser desacoplada. O `yargs` é apenas uma **implementação funcional** e pode ser substituída no futuro por outro CLI parser, sem impactos nas regras de negócio.

---

### 🧠 `domain/`

Contém tudo que é puramente relacionado ao negócio:

- `entities/`: objetos com comportamento (Order, Customer, etc.)
- `valueObjects/`: tipos imutáveis com regras de validação
- `errors/`: erros ricos e específicos do domínio
- `repositories/`: interfaces (contratos) para persistência
- `events/`: eventos de domínio disparados pelas entidades

---

### 🚀 `useCases/`

Casos de uso organizados por feature. Cada pasta representa uma funcionalidade completa, contendo:

- `UseCase.ts`: lógica principal
- `Input.ts`, `Output.ts`: contratos de entrada e saída
- `Validator.ts`: validações com Zod
- `di.ts`: setup de injeção de dependência
- `Controller.ts`, `Command.ts` ou `EventHandler.ts`: conforme o canal de entrada (HTTP, CLI ou eventos)

> Esse padrão permite isolar cada funcionalidade, facilitando testes, manutenção e escalabilidade.

---

### 🔌 `infra/`

Contém as implementações concretas que interagem com o "mundo externo":

- `http/`: servidor Express e middlewares
- `cli/`: entrypoint dos comandos de terminal
- `eventBus/`: RabbitMQ e registro de handlers
- `db/`: conexão com banco, migrations e seeds via Knex
- `services/`: integrações como SES, Winston, Handlebars, etc.
- `repositories/`: implementações dos repositórios definidos no domínio

---

### 🧱 `shared/`

Infraestrutura compartilhada entre contextos:

- `env.ts`: carregamento de variáveis do `.env`
- `DIContainer.ts`: injeção de dependência
- `UnityOfWork.ts`: interface de controle transacional
- `EventBus.ts`: abstração para publicação/disparo de eventos
- `ErrorHandler.ts`: tratamento centralizado de exceções

---

### 🧪 `tests/`

Organizado por contexto:

- `factories/`: helpers para criação de entidades de teste
- `domain/repositories/`: mocks dos repositórios
- `shared/kernel/`: mocks do event bus, unit of work, etc.

---

## 🧪 Running Tests

O projeto utiliza o [Vitest](https://vitest.dev/) para testes unitários.

Para executar todos os testes:

```bash
pnpm test
```

---

### 🧪 Organização dos Testes

Os testes são organizados por contexto e feature, seguindo o padrão `package by feature`. Os mocks e factories ficam fora da pasta principal para facilitar reuso e manter os use cases limpos:

```
tests/
├── domain/           # Mocks de repositórios
├── factories/        # Funções de criação de entidades de teste (makeCustomer, makeProduct, etc.)
└── shared/           # Mocks de serviços genéricos (EventBus, UnitOfWork, etc.)
```

Cada caso de uso (em `src/useCases/`) pode conter seus próprios arquivos `*.spec.ts` para garantir o isolamento da lógica de negócio.

---

Os testes são rápidos, sem dependência de banco ou fila, focando na regra de negócio. Para testes mais profundos (integração, e2e), você pode estender esse setup no futuro.

---

## 🔐 Best Practices

O projeto adota uma série de boas práticas que favorecem a **clareza, escalabilidade e manutenibilidade** ao longo do tempo. Abaixo estão os principais princípios seguidos:

---

### 🧱 Arquitetura Limpa

- Separação clara entre camadas: `domain`, `useCases`, `infra`, `shared`
- O domínio **não depende de nada externo** (frameworks, drivers, banco, etc.)
- Casos de uso são os únicos responsáveis por coordenar repositórios, validações, serviços e transações

---

### 📦 Package by Feature

- Cada pasta em `useCases/` representa uma **feature isolada**
- Contém tudo que ela precisa: validação, controller ou comando, injeção de dependência e testes
- Facilita onboarding, manutenção e refatorações pontuais

---

### 🔁 Injeção de Dependência Local

- Cada feature define suas próprias dependências
- Evita acoplamento e permite múltiplas estratégias de implementação
- Não usa DI global, garantindo escopo por request e compatibilidade com qualquer bundler

---

### ✅ Testabilidade

- `useCases` são 100% testáveis sem framework externo
- Mocks e factories são centralizados na pasta `tests/`, organizados por contexto
- Sem efeitos colaterais implícitos, sem estado compartilhado

---

### ✍️ Validação Explícita

- Cada caso de uso define um **tipo de entrada explícito** (`Input.ts`) como contrato
- A validação com `zod` garante que os dados recebidos estejam **conformes esse contrato**
- O uso de `satisfies` garante que **tipo e schema estão sempre sincronizados**
- A validação é totalmente **desacoplada do transporte** (pode ser usada em HTTP, CLI, eventos, etc.)

---

### 🪶 Build Leve e Modular

- `esbuild` para compilar apenas o necessário por entrypoint (`web`, `cli`, `eventbus`, `schedule`)
- Sem `require` dinâmico ou magic loaders
- Imagens Docker minimalistas com stages separados

---

### 🛡️ Segurança

- Middleware de segurança (`helmet`, `cors`, etc.)
- Variáveis sensíveis isoladas via `.env`
- Preparado para autenticação, autorização e rastreabilidade com logs estruturados

---

Esse conjunto de práticas cria uma base **flexível, robusta e fácil de evoluir** ao longo do tempo, sem comprometer a clareza e a simplicidade do código.

---

## 🤝 Contributing

Contribuições são muito bem-vindas!

Se você encontrou um problema, tem sugestões de melhorias ou quer adicionar uma nova feature, sinta-se à vontade para abrir uma issue ou enviar um PR.

Este projeto foi feito com muito cuidado e atenção aos detalhes, buscando equilíbrio entre clareza e robustez.  
Se for contribuir, mantenha os princípios do projeto: **modularidade, simplicidade e propósito.**

---

## 📄 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute it, even for commercial purposes.  
Just keep the original copyright.

---

Desenvolvido com ❤️ por [@jeanvcastro](https://github.com/jeanvcastro)
