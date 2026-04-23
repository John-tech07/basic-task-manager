import { CheckCircle2, ChevronRightIcon, Circle, ClipboardX, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function Tasks({ tasks, onTaskClick, onDeleteTaskClick }) {
    const navigate = useNavigate();

    function onSeeDetailsClick(task) {
        navigate(`/task?id=${task.id}`);
    }

    if (!tasks.length) {
        return (
            <div className="p-6 bg-slate-200 rounded-md shadow flex flex-col items-center gap-2 text-slate-400">
                <ClipboardX size={36} />
                <p>Nenhuma tarefa ainda. Adicione uma acima!</p>
            </div>
        );
    }

    return (
        <ul className="space-y-4 p-6 bg-slate-200 rounded-md shadow">
            {tasks.map((task) => (
                <li key={task.id} className="flex gap-2 min-w-0">
                    <button
                        onClick={() => onTaskClick(task.id)}
                        className={`bg-slate-400 w-full min-w-0 text-left text-white p-2 flex items-center gap-2 rounded-md ${task.isCompleted && 'line-through opacity-70'}`}
                    >
                        <span className="shrink-0">
                            {task.isCompleted
                                ? <CheckCircle2 size={18} />
                                : <Circle size={18} />
                            }
                        </span>
                        <span className="truncate">{task.title}</span>
                    </button>
                    <Button
                        onClick={() => onSeeDetailsClick(task)}
                        aria-label="Ver detalhes"
                    >
                        <ChevronRightIcon size={18} />
                    </Button>
                    <Button
                        onClick={() => onDeleteTaskClick(task.id)}
                        aria-label="Deletar tarefa"
                    >
                        <TrashIcon size={18} />
                    </Button>
                </li>
            ))}
        </ul>
    );
}

export default Tasks;
