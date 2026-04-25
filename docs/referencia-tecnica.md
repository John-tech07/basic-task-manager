# Referência Técnica

## Stack

| Tecnologia | Versão |
|---|---|
| React | 18.3.1 |
| Vite | 5.4.1 |
| Tailwind CSS | 3.4.10 |
| React Router DOM | 6.26.1 |
| Lucide React | 0.435.0 |
| @supabase/supabase-js | 2.104.1 |
| Linguagem | JavaScript (JSX) — sem TypeScript |
| Hospedagem | Vercel (CDN estático) |
| Backend | Supabase Cloud (BaaS) |

---

## Arquitetura

```
Browser (React SPA)
      │  supabase-js (HTTPS + JWT)
      ▼
Supabase Cloud
      ├── PostgREST  →  REST API automática das tabelas
      ├── Auth       →  gestão de usuários e sessões
      └── PostgreSQL →  dados persistidos com RLS
```

Não há servidor Node.js customizado. O frontend comunica-se diretamente com o Supabase via SDK. Toda autorização é feita via **Row Level Security (RLS)** no banco — nem o frontend nem uma camada intermediária controlam o acesso.

---

## Estrutura de pastas

```
src/
├── main.jsx                   # Entry point — roteador + AuthProvider
├── App.jsx                    # Shell principal (tela de tarefas)
├── index.css                  # Tailwind base
├── lib/supabase.js            # Instância única do cliente Supabase
├── contexts/AuthContext.jsx   # Estado global de autenticação
├── hooks/useTasks.js          # CRUD de tarefas com Supabase
├── pages/
│   ├── LoginPage.jsx          # /login
│   ├── RegisterPage.jsx       # /register
│   ├── ForgotPasswordPage.jsx # /forgot-password
│   ├── ResetPasswordPage.jsx  # /reset-password
│   └── TaskPage.jsx           # /task?id=UUID
└── components/
    ├── features/              # Componentes com lógica de domínio
    │   ├── AddTask.jsx
    │   ├── TaskList.jsx
    │   ├── TaskItem.jsx
    │   ├── TaskEditForm.jsx
    │   ├── TaskDeleteConfirm.jsx
    │   └── TaskFilters.jsx
    └── ui/                    # Primitivos visuais reutilizáveis
        ├── Button.jsx
        ├── Input.jsx
        ├── EmptyState.jsx
        └── PrivateRoute.jsx
```

---

## Rotas

| Rota | Tipo | Componente |
|---|---|---|
| `/` | Protegida | `App` |
| `/task?id=UUID` | Protegida | `TaskPage` |
| `/login` | Pública | `LoginPage` |
| `/register` | Pública | `RegisterPage` |
| `/forgot-password` | Pública | `ForgotPasswordPage` |
| `/reset-password` | Pública | `ResetPasswordPage` |

`PrivateRoute` envolve as rotas protegidas no roteador. Redireciona para `/login` se não autenticado, exibe "Carregando..." enquanto a sessão é verificada.

---

## Estado global

Apenas autenticação usa estado global via `AuthContext`:

```
user          — objeto do usuário Supabase ou null
loading       — true enquanto a sessão está sendo verificada
signIn()
signUp()
signOut()
sendPasswordReset()
```

O estado das tarefas é local ao hook `useTasks`, instanciado em `App.jsx`. Não há Zustand, Redux ou MobX.

---

## Hook `useTasks`

Gerencia o estado completo das tarefas do usuário autenticado.

| Campo | Tipo | Descrição |
|---|---|---|
| `tasks` | array | Lista no formato camelCase |
| `loading` | boolean | True durante carregamento inicial |
| `error` | string\|null | Mensagem de erro do Supabase |
| `addTask(title, desc, dueAt)` | async | Cria tarefa |
| `toggleTask(taskId)` | async | Alterna `isCompleted` |
| `editTask(id, title, desc, dueAt)` | async | Edita campos |
| `deleteTask(taskId)` | async | Exclui tarefa |

Na inicialização, migra tarefas do `localStorage` para o Supabase automaticamente (executa uma única vez; remove o localStorage após sucesso).

---

## Banco de dados

### Tabela `tasks`

| Campo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` | Chave primária |
| `user_id` | uuid FK | — | FK → `auth.users(id)` ON DELETE CASCADE |
| `title` | text | — | Obrigatório |
| `description` | text | `''` | Opcional |
| `is_completed` | boolean | `false` | Status de conclusão |
| `created_at` | timestamptz | `now()` | Criação (UTC) |
| `due_at` | timestamptz | null | Prazo opcional (UTC) |

### Tabela `user_settings`

| Campo | Tipo | Descrição |
|---|---|---|
| `user_id` | uuid PK/FK | ON DELETE CASCADE |
| `app_title` | text | Título customizável da lista |

### Políticas RLS (ambas as tabelas)

Todas as operações (SELECT, INSERT, UPDATE, DELETE) exigem `auth.uid() = user_id`. A tabela `user_settings` não tem política de DELETE — o registro é excluído em cascata com o usuário.

---

## Autenticação

Supabase Auth com e-mail e senha. O SDK gerencia armazenamento, envio e renovação do JWT automaticamente.

**Login:**
```
signInWithPassword → session no localStorage → onAuthStateChange → user no AuthContext → navigate("/")
```

**Cadastro:**
```
signUp → e-mail de confirmação → usuário clica no link → conta ativada → pode fazer login
```

**Reset de senha:**
```
resetPasswordForEmail → link com token → /reset-password → updateUser({ password })
```

**Logout:**
```
signOut → SDK remove token → onAuthStateChange(null) → PrivateRoute → /login
```

O `access_token` expira em 1h; o SDK renova automaticamente via `refresh_token`.

---

## Operações de dados (API Supabase)

```js
// Listar tarefas
supabase.from("tasks").select("*").order("created_at", { ascending: true })

// Criar
supabase.from("tasks").insert({ user_id, title, description, due_at }).select().single()

// Editar
supabase.from("tasks").update({ title, description, due_at }).eq("id", taskId)

// Alternar conclusão
supabase.from("tasks").update({ is_completed: boolean }).eq("id", taskId)

// Excluir
supabase.from("tasks").delete().eq("id", taskId)

// Título da lista — upsert
supabase.from("user_settings").upsert({ user_id, app_title }, { onConflict: "user_id" })

// Migração do localStorage
supabase.from("tasks").upsert(rows, { onConflict: "id" })
```

O RLS garante que cada operação afeta somente os registros do usuário autenticado.

---

## Componentes notáveis

**`Button`** — base `bg-slate-100 text-slate-600 min-h-[44px]`. Overrides de cor requerem o modificador `!` do Tailwind (`!bg-red-500`) por conflito de ordem no CSS gerado.

**`Input`** — detecta `type="datetime-local"` e usa padding reduzido (`px-2 sm:px-3`) para evitar overflow do seletor nativo em mobile.

**`TaskItem`** — exibe prazo em vermelho se vencido e a tarefa não está concluída; índigo caso contrário.
