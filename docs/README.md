# Gerenciador de Tarefas

Aplicação web para criação e gerenciamento de tarefas pessoais. Cada usuário possui sua própria lista isolada, com suporte a título customizável, descrição, prazo, filtros por status, reordenação manual por drag-and-drop e tema claro/escuro.

## Problema resolvido

Organização pessoal de tarefas com persistência em nuvem, acessível de qualquer dispositivo após autenticação.

## Usuários

Qualquer pessoa que se cadastre na aplicação. Não há papéis (roles) ou hierarquia de usuários.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18.3 + Vite 5.4 + Tailwind CSS 3.4 |
| Roteamento | React Router DOM 6.26 |
| Ícones | Lucide React 0.435 |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities |
| Backend / Auth | Supabase (BaaS) |
| Banco de dados | PostgreSQL (gerenciado pelo Supabase) |
| Hospedagem | Vercel (frontend) + Supabase Cloud (banco) |

## Funcionalidades

- Autenticação completa (login, cadastro, recuperação e redefinição de senha)
- CRUD de tarefas com título, descrição opcional e prazo opcional
- Reordenação manual por drag-and-drop (persistida no banco)
- Filtros por status: todas, pendentes, concluídas
- Prazo com alerta visual quando vencido
- Título da lista customizável por usuário
- Página de detalhes da tarefa
- Tema claro/escuro com persistência de preferência
- Auto-delete de tarefas concluídas após 7 dias

## Documentação

- [Referência Técnica](referencia-tecnica.md) — arquitetura, stack, componentes, banco de dados, autenticação e operações de dados
- [Guia Operacional](guia-operacional.md) — setup local, variáveis de ambiente, deploy e decisões técnicas
