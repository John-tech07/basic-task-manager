import { CalendarIcon, CheckCircle2, ChevronRightIcon, Circle, EllipsisVertical, GripVertical, PencilIcon, TrashIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function TaskItem({ task, onToggle, onEdit, onSeeDetails, onDeleteRequest, isDraggable }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        disabled: !isDraggable,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-1.5 sm:gap-2 min-w-0 ${isDragging ? "opacity-40" : ""}`}
        >
            {isDraggable && (
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing touch-none shrink-0 text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500 p-1"
                    aria-label="Arrastar tarefa"
                >
                    <GripVertical size={16} />
                </button>
            )}

            <button
                onClick={() => onToggle(task.id)}
                className="flex-1 min-w-0 min-h-[44px] flex items-center gap-2 sm:gap-3 text-left group"
            >
                <span className={`shrink-0 ${task.isCompleted ? "text-indigo-500" : "text-slate-300 dark:text-slate-600"}`}>
                    {task.isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </span>
                <span className="flex flex-col min-w-0">
                    <span className={`text-sm font-medium truncate transition-colors ${
                        task.isCompleted
                            ? "line-through text-slate-400 dark:text-slate-500"
                            : "text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}>
                        {task.title}
                    </span>
                    {task.dueAt && (
                        <span className={`text-xs flex items-center gap-1 mt-0.5 ${
                            !task.isCompleted && new Date(task.dueAt) < new Date()
                                ? "text-red-400"
                                : "text-indigo-400"
                        }`}>
                            <CalendarIcon size={11} />
                            {new Intl.DateTimeFormat("pt-BR", {
                                day: "2-digit", month: "2-digit", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                            }).format(new Date(task.dueAt))}
                        </span>
                    )}
                </span>
            </button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Ações da tarefa"
                    >
                        <EllipsisVertical size={16} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onSelect={() => onEdit(task)}>
                        <PencilIcon aria-hidden="true" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onSeeDetails(task)}>
                        <ChevronRightIcon aria-hidden="true" />
                        Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-500 focus:bg-red-50 focus:text-red-500 dark:focus:bg-red-950 dark:focus:text-red-400"
                        onSelect={() => onDeleteRequest(task.id)}
                    >
                        <TrashIcon aria-hidden="true" />
                        Deletar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default TaskItem;
