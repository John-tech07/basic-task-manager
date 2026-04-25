import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../ui/EmptyState";
import TaskDeleteConfirm from "./TaskDeleteConfirm";
import TaskEditForm from "./TaskEditForm";
import TaskFilters from "./TaskFilters";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onTaskClick, onDeleteTaskClick, onEditTask }) {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    if (!tasks.length) {
        return (
            <div className="bg-white rounded-xl shadow-md">
                <EmptyState message="Nenhuma tarefa ainda. Adicione uma acima!" />
            </div>
        );
    }

    const filteredTasks = tasks
        .filter(task => {
            if (filter === "pending")   return !task.isCompleted;
            if (filter === "completed") return task.isCompleted;
            return true;
        })
        .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));

    const emptyMessages = {
        pending:   "Nenhuma tarefa pendente.",
        completed: "Nenhuma tarefa concluída.",
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <TaskFilters
                filter={filter}
                onFilterChange={setFilter}
                completedCount={tasks.filter(t => t.isCompleted).length}
                totalCount={tasks.length}
            />

            {filteredTasks.length === 0 ? (
                <EmptyState message={emptyMessages[filter]} />
            ) : (
                <ul className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
                    {filteredTasks.map(task => (
                        <li key={task.id} className="px-3 py-2 sm:p-3">
                            {deletingId === task.id ? (
                                <TaskDeleteConfirm
                                    onConfirm={() => { onDeleteTaskClick(task.id); setDeletingId(null); }}
                                    onCancel={() => setDeletingId(null)}
                                />
                            ) : editingId === task.id ? (
                                <TaskEditForm
                                    task={task}
                                    onSave={(id, title, desc, dueAt) => { onEditTask(id, title, desc, dueAt); setEditingId(null); }}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <TaskItem
                                    task={task}
                                    onToggle={onTaskClick}
                                    onEdit={(t) => { setEditingId(t.id); setDeletingId(null); }}
                                    onSeeDetails={(t) => navigate(`/task?id=${t.id}`)}
                                    onDeleteRequest={(id) => { setDeletingId(id); setEditingId(null); }}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <p className="text-xs text-slate-400 text-center py-2">
                Tarefas concluídas são deletadas automaticamente após 7 dias.
            </p>
        </div>
    );
}

export default TaskList;
