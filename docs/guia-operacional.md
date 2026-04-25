# Guia Operacional

## Pré-requisitos

- Node.js 18+ (LTS)
- npm 9+
- Conta no [Supabase](https://supabase.com) com projeto configurado

---

## Setup local

```bash
git clone <url-do-repositorio>
cd basic-task-manager
npm install
cp .env.example .env.local   # preencher com as credenciais abaixo
```

### Variáveis de ambiente

| Variável | Onde obter |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → General → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API Keys → Publishable key |

Arquivo `.env.local` (não commitado — coberto por `*.local` no `.gitignore`):

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_sua_chave
```

A `VITE_SUPABASE_ANON_KEY` é pública por design — o RLS no banco impede acesso a dados de outros usuários mesmo com ela.

### Banco de dados

No painel do Supabase, **SQL Editor** → execute o conteúdo de `supabase/schema.sql`.

Se o banco já existia sem a coluna `due_at`:
```sql
ALTER TABLE tasks ADD COLUMN due_at timestamptz;
```

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento em `localhost:5173` |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint |

---

## Deploy (Vercel)

1. Conecte o repositório à Vercel
2. **Settings → Environment Variables** — adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. O build roda `npm run build` automaticamente

> Variáveis adicionadas após um deploy exigem **Redeploy** (sem cache) para entrarem no bundle.

### URL de redirect para reset de senha

No Supabase → **Authentication → URL Configuration → Redirect URLs**, adicione:
```
https://seu-dominio.vercel.app/reset-password
```

Sem isso, links de recuperação de senha não funcionam em produção.

---

## Limites do plano gratuito (Supabase)

| Recurso | Limite |
|---|---|
| Egresso de dados (API) | 500 MB / mês |
| Conexões simultâneas ao banco | 60 |
| E-mails de autenticação | 3 por hora |
| Tamanho do banco | 500 MB |
| Usuários | Ilimitados |

**Estimativa de uso:** cada requisição de listagem consome ~500 bytes por tarefa retornada. Com 6 usuários abrindo o app ~30 vezes ao dia e ~50 tarefas cada, o consumo mensal fica em torno de **150 MB** — dentro do limite com margem.

O gargalo mais provável no dia a dia é o **limite de e-mails** (3/hora), que afeta cadastro e recuperação de senha durante testes intensivos.

---

## Decisões técnicas

**Supabase como backend completo** — elimina servidor Node.js, auth e banco separados. Trade-off: toda autorização depende das políticas RLS.

**RLS como única camada de autorização** — a `anon key` é exposta no bundle por design; o PostgreSQL rejeita acesso a dados de outros usuários independentemente.

**JavaScript sem TypeScript** — reduz fricção de setup; trade-off é ausência de checagem estática.

**Context API para auth** — escopo simples não justifica Zustand/Redux. Trade-off: re-renders em árvores grandes se o contexto crescer.

**`useTasks` encapsula todo o CRUD** — componentes só renderizam; o hook cuida dos dados.

**Migração automática do localStorage** — preserva tarefas da versão anterior sem ação do usuário; executa uma única vez.

**Tailwind `!important` em overrides de cor** — `Button` define classes base; props de cor customizadas precisam do prefixo `!` por conflito de ordem no CSS gerado.

**Sem migrations** — schema aplicado manualmente via SQL Editor. Alterações futuras precisam ser executadas manualmente em cada ambiente.

**Online-only** — sem cache local, service worker ou sync offline. Decisão intencional para manter a implementação simples.
