import { CheckCircle2, ChevronRightIcon, Circle, PencilIcon, TrashIcon } from "lucide-react";
import Button from "../ui/Button";

function TaskItem({ task, onToggle, onEdit, onSeeDetails, onDeleteRequest }) {
    return (
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <button
                onClick={() => onToggle(task.id)}
                className="flex-1 min-w-0 min-h-[44px] flex items-center gap-2 sm:gap-3 text-left group"
            >
                <span className={`shrink-0 ${task.isCompleted ? "text-indigo-500" : "text-slate-300"}`}>
                    {task.isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </span>
                <span className="flex flex-col min-w-0">
                    <span className={`text-sm font-medium truncate transition-colors ${
                        task.isCompleted
                            ? "line-through text-slate-400"
                            : "text-slate-700 group-hover:text-indigo-600"
                    }`}>
                        {task.title}
                    </span>
                    {task.createdAt && (
                        <span className="text-xs text-slate-400">
                            {new Intl.DateTimeFormat("pt-BR").format(new Date(task.createdAt))}
                        </span>
                    )}
                </span>
            </button>
            <div className="flex items-center gap-1 shrink-0">
                <Button onClick={() => onEdit(task)} aria-label="Editar tarefa">
                    <PencilIcon size={16} />
                </Button>
                <Button onClick={() => onSeeDetails(task)} aria-label="Ver detalhes">
                    <ChevronRightIcon size={16} />
                </Button>
                <Button onClick={() => onDeleteRequest(task.id)} aria-label="Deletar tarefa">
                    <TrashIcon size={16} />
                </Button>
            </div>
        </div>
    );
}

export default TaskItem;
