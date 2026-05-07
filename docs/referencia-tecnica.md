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
| @dnd-kit/core | — |
| @dnd-kit/sortable | — |
| @dnd-kit/utilities | — |
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
├── hooks/
│   ├── useTasks.js            # CRUD + reordenação de tarefas com Supabase
│   └── useTheme.js            # Tema claro/escuro com persistência em localStorage
├── pages/
│   ├── LoginPage.jsx          # /login
│   ├── RegisterPage.jsx       # /register
│   ├── ForgotPasswordPage.jsx # /forgot-password
│   ├── ResetPasswordPage.jsx  # /reset-password
│   └── TaskPage.jsx           # /task?id=UUID
└── components/
    ├── tasks/                 # Componentes de domínio de tarefas
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

O estado das tarefas é local ao hook `useTasks`, instanciado em `App.jsx`. O estado do tema é gerenciado via DOM (`document.documentElement`) pelo hook `useTheme`. Não há Zustand, Redux ou MobX.

---

## Hook `useTasks`

Gerencia o estado completo das tarefas do usuário autenticado.

| Campo | Tipo | Descrição |
|---|---|---|
| `tasks` | array | Lista no formato camelCase, ordenada por `position` |
| `loading` | boolean | True durante carregamento inicial |
| `error` | string\|null | Mensagem de erro do Supabase |
| `addTask(title, desc, dueAt)` | async | Cria tarefa com próxima posição |
| `toggleTask(taskId)` | async | Alterna `isCompleted` |
| `editTask(id, title, desc, dueAt)` | async | Edita campos |
| `deleteTask(taskId)` | async | Exclui tarefa |
| `reorderTasks(newOrderedTasks)` | async | Reordena otimisticamente + upsert de posições em lote |

Na inicialização, migra tarefas do `localStorage` para o Supabase automaticamente. Tarefas com `position = null` (existentes antes da feature) recebem posições sequenciais automaticamente na primeira carga.

---

## Hook `useTheme`

Gerencia o tema claro/escuro da aplicação.

| Campo | Tipo | Descrição |
|---|---|---|
| `theme` | `'light' \| 'dark'` | Tema atual |
| `isDark` | boolean | Atalho para `theme === 'dark'` |
| `toggleTheme()` | função | Alterna entre claro e escuro |

**Funcionamento:**
1. Na inicialização lê `localStorage.getItem('theme')`
2. Se não houver preferência salva, usa `prefers-color-scheme` do sistema
3. Aplica/remove a classe `dark` em `document.documentElement`
4. Persiste a escolha no `localStorage`

Um script inline no `index.html` aplica a classe antes do React montar, evitando flash do tema errado (FOUC).

O botão de toggle (Sun/Moon) fica no header do `App.jsx`. Páginas de autenticação recebem o tema via classe já aplicada no `<html>` pelo script inline — sem necessidade de chamar o hook nelas.

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
| `position` | integer | null | Ordem de exibição (null = sem posição definida) |

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
// Listar tarefas (ordenado por posição)
supabase.from("tasks").select("*")
  .order("position", { ascending: true, nullsFirst: false })
  .order("created_at", { ascending: true })

// Criar (com posição)
supabase.from("tasks").insert({ user_id, title, description, due_at, position }).select().single()

// Editar
supabase.from("tasks").update({ title, description, due_at }).eq("id", taskId)

// Alternar conclusão
supabase.from("tasks").update({ is_completed: boolean }).eq("id", taskId)

// Excluir
supabase.from("tasks").delete().eq("id", taskId)

// Reordenar (upsert em lote)
supabase.from("tasks").upsert([{ id, position }, ...], { onConflict: "id" })

// Título da lista — upsert
supabase.from("user_settings").upsert({ user_id, app_title }, { onConflict: "user_id" })
```

O RLS garante que cada operação afeta somente os registros do usuário autenticado.

---

## Componentes notáveis

**`Button`** — base `bg-slate-100 text-slate-600 min-h-[44px]`. Overrides de cor requerem o modificador `!` do Tailwind (`!bg-red-500`) por conflito de ordem no CSS gerado.

**`Input`** — detecta `type="datetime-local"` e usa padding reduzido (`px-2 sm:px-3`) para evitar overflow do seletor nativo em mobile.

**`TaskItem`** — exibe prazo em vermelho se vencido e a tarefa não está concluída; índigo caso contrário. Quando `isDraggable=true`, exibe handle GripVertical à esquerda; integra `useSortable` do dnd-kit para animação de drag.

**`TaskList`** — envolve a lista com `DndContext` e `SortableContext` do dnd-kit. Drag habilitado apenas no filtro "Todas" — em views filtradas o handle some e a lista é somente leitura. Usa `PointerSensor` (distância mínima de 8px) e `TouchSensor` (delay de 250ms) para evitar drags acidentais.
