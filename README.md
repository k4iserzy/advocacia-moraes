# Moraes & Associados

Plataforma web para o escritório Moraes & Associados, com apresentação de serviços jurídicos, agendamento de consultas, portal do cliente e painel administrativo.

## Funcionalidades

- Consulta de áreas de atuação e equipe jurídica.
- Agendamento e acompanhamento de consultas.
- Área do cliente com notificações.
- Painel administrativo para gestão de consultas e conteúdo.
- Assistente jurídico integrado à interface.

## Tecnologias

- React, TypeScript e Vite.
- Supabase para banco de dados e autenticação via funções SQL.

## Requisitos

- Node.js e npm.
- Um projeto Supabase.

## Configuração

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local` na raiz do projeto com as credenciais do seu projeto Supabase:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
```

Use somente a chave pública `anon` no frontend. Nunca coloque a chave `service_role` neste arquivo ou no código do cliente.

No SQL Editor do Supabase, execute as migrations na ordem:

1. [`migrations/001_initial_schema.sql`](migrations/001_initial_schema.sql)
2. [`migrations/002_enable_frontend_access.sql`](migrations/002_enable_frontend_access.sql)
3. [`migrations/003_add_password_authentication.sql`](migrations/003_add_password_authentication.sql)
4. [`migrations/004_secure_public_authentication.sql`](migrations/004_secure_public_authentication.sql)

A segunda migration cria o usuário administrador `admin@moraes.adv.br`. Ela não informa uma senha em texto; defina uma senha conhecida no banco antes de usar essa conta.

> As políticas de acesso da migration `002` são amplas para facilitar o protótipo. Revise as políticas de Row Level Security antes de usar o sistema em produção.

## Executar

```bash
npm run dev
```

O Vite inicia o servidor local na porta `3000`.

## Verificações

```bash
npm run lint
npm run build
```
