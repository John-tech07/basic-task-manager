import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import EmptyState from "../ui/EmptyState";
import TaskDeleteConfirm from "./TaskDeleteConfirm";
import TaskEditForm from "./TaskEditForm";
import TaskFilters from "./TaskFilters";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onTaskClick, onDeleteTaskClick, onEditTask, onReorderTasks }) {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    );

    function handleDragEnd({ active, over }) {
        if (!over || active.id === over.id) return;
        const oldIndex = tasks.findIndex(t => t.id === active.id);
        const newIndex = tasks.findIndex(t => t.id === over.id);
        onReorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }

    if (!tasks.length) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md">
                <EmptyState message="Nenhuma tarefa ainda. Adicione uma acima!" />
            </div>
        );
    }

    const filteredTasks = tasks.filter(task => {
        if (filter === "pending")   return !task.isCompleted;
        if (filter === "completed") return task.isCompleted;
        return true;
    });

    const isDraggable = filter === "all";

    const emptyMessages = {
        pending:   "Nenhuma tarefa pendente.",
        completed: "Nenhuma tarefa concluída.",
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
            <TaskFilters
                filter={filter}
                onFilterChange={setFilter}
                completedCount={tasks.filter(t => t.isCompleted).length}
                totalCount={tasks.length}
            />

            {filteredTasks.length === 0 ? (
                <EmptyState message={emptyMessages[filter]} />
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={filteredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <ul className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[60vh] overflow-y-auto">
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
                                            isDraggable={isDraggable}
                                            onToggle={onTaskClick}
                                            onEdit={(t) => { setEditingId(t.id); setDeletingId(null); }}
                                            onSeeDetails={(t) => navigate(`/task?id=${t.id}`)}
                                            onDeleteRequest={(id) => { setDeletingId(id); setEditingId(null); }}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">
                Tarefas concluídas são deletadas automaticamente após 7 dias.
            </p>
        </div>
    );
}

export default TaskList;
