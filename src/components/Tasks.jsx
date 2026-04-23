import { AlertCircle, CheckIcon, CheckCircle2, ChevronRightIcon, Circle, ClipboardX, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

const FILTERS = [
    { value: "all",       label: "Todas"      },
    { value: "pending",   label: "Pendentes"  },
    { value: "completed", label: "Concluídas" },
];

function Tasks({ tasks, onTaskClick, onDeleteTaskClick, onEditTask }) {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const [deletingId, setDeletingId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editError, setEditError] = useState("");

    function onSeeDetailsClick(task) {
        navigate(`/task?id=${task.id}`);
    }

    function startEditing(task) {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditError("");
    }

    function handleSave(taskId) {
        if (!editTitle.trim()) {
            setEditError("O título é obrigatório!");
            return;
        }
        onEditTask(taskId, editTitle.trim(), editDescription.trim());
        setEditingId(null);
        setEditError("");
    }

    function handleCancel() {
        setEditingId(null);
        setEditError("");
    }

    function handleDeleteRequest(taskId) {
        setDeletingId(taskId);
        setEditingId(null);
    }

    function handleDeleteConfirm(taskId) {
        onDeleteTaskClick(taskId);
        setDeletingId(null);
    }

    function handleDeleteCancel() {
        setDeletingId(null);
    }

    function handleKeyDown(e, taskId) {
        if (e.key === "Enter") handleSave(taskId);
        if (e.key === "Escape") handleCancel();
    }

    if (!tasks.length) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center gap-3 text-slate-400">
                <ClipboardX size={40} />
                <p className="text-sm">Nenhuma tarefa ainda. Adicione uma acima!</p>
            </div>
        );
    }

    const completedCount = tasks.filter(t => t.isCompleted).length;

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
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100">
                <div className="flex gap-1.5">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                filter === f.value
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                    {completedCount} de {tasks.length} concluída{tasks.length !== 1 ? "s" : ""}
                </span>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="p-8 flex flex-col items-center gap-3 text-slate-400">
                    <ClipboardX size={36} />
                    <p className="text-sm">{emptyMessages[filter]}</p>
                </div>
            ) : (
                <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {filteredTasks.map((task) => (
                        <li key={task.id} className="p-3">
                            {deletingId === task.id ? (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-3 rounded-lg">
                                    <p className="text-red-600 text-sm font-medium flex-1">Deletar esta tarefa?</p>
                                    <Button onClick={handleDeleteCancel} aria-label="Cancelar exclusão">
                                        <XIcon size={16} />
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteConfirm(task.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        aria-label="Confirmar exclusão"
                                    >
                                        <TrashIcon size={16} />
                                    </Button>
                                </div>
                            ) : editingId === task.id ? (
                                <div className="flex flex-col gap-2">
                                    <Input
                                        value={editTitle}
                                        onChange={(e) => { setEditTitle(e.target.value); setEditError(""); }}
                                        onKeyDown={(e) => handleKeyDown(e, task.id)}
                                        placeholder="Título"
                                        autoFocus
                                    />
                                    <Input
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, task.id)}
                                        placeholder="Descrição (opcional)"
                                    />
                                    {editError && (
                                        <p className="text-red-500 text-sm flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {editError}
                                        </p>
                                    )}
                                    <div className="flex gap-2 justify-end">
                                        <Button onClick={handleCancel} aria-label="Cancelar edição">
                                            <XIcon size={16} />
                                        </Button>
                                        <Button
                                            onClick={() => handleSave(task.id)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                            aria-label="Salvar edição"
                                        >
                                            <CheckIcon size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onTaskClick(task.id)}
                                        className="flex-1 min-w-0 flex items-center gap-3 text-left group"
                                    >
                                        <span className={`shrink-0 ${task.isCompleted ? "text-indigo-500" : "text-slate-300"}`}>
                                            {task.isCompleted
                                                ? <CheckCircle2 size={22} />
                                                : <Circle size={22} />
                                            }
                                        </span>
                                        <span className="flex flex-col min-w-0">
                                            <span className={`text-sm font-medium truncate transition-colors ${task.isCompleted ? "line-through text-slate-400" : "text-slate-700 group-hover:text-indigo-600"}`}>
                                                {task.title}
                                            </span>
                                            {task.createdAt && (
                                                <span className="text-xs text-slate-400">
                                                    {new Intl.DateTimeFormat("pt-BR").format(new Date(task.createdAt))}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                    <Button onClick={() => startEditing(task)} aria-label="Editar tarefa">
                                        <PencilIcon size={16} />
                                    </Button>
                                    <Button onClick={() => onSeeDetailsClick(task)} aria-label="Ver detalhes">
                                        <ChevronRightIcon size={16} />
                                    </Button>
                                    <Button onClick={() => handleDeleteRequest(task.id)} aria-label="Deletar tarefa">
                                        <TrashIcon size={16} />
                                    </Button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Tasks;
