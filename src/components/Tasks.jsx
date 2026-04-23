import { AlertCircle, CheckIcon, CheckCircle2, ChevronRightIcon, Circle, ClipboardX, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

const FILTERS = [
    { value: "all",       label: "Todas"     },
    { value: "pending",   label: "Pendentes" },
    { value: "completed", label: "Concluídas"},
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
            <div className="p-6 bg-slate-200 rounded-md shadow flex flex-col items-center gap-2 text-slate-400">
                <ClipboardX size={36} />
                <p>Nenhuma tarefa ainda. Adicione uma acima!</p>
            </div>
        );
    }

    const filteredTasks = tasks.filter(task => {
        if (filter === "pending")   return !task.isCompleted;
        if (filter === "completed") return task.isCompleted;
        return true;
    });

    const emptyMessages = {
        pending:   "Nenhuma tarefa pendente.",
        completed: "Nenhuma tarefa concluída.",
    };

    const completedCount = tasks.filter(t => t.isCompleted).length;

    return (
        <div className="bg-slate-200 rounded-md shadow">
            <div className="flex items-center justify-between gap-2 p-4 border-b border-slate-300">
                <div className="flex gap-2">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                filter === f.value
                                    ? "bg-slate-500 text-white"
                                    : "bg-slate-300 text-slate-600 hover:bg-slate-400 hover:text-white"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                    {completedCount} de {tasks.length} concluída{tasks.length !== 1 ? "s" : ""}
                </span>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="p-6 flex flex-col items-center gap-2 text-slate-400">
                    <ClipboardX size={36} />
                    <p>{emptyMessages[filter]}</p>
                </div>
            ) : (
                <ul className="space-y-4 p-6 max-h-96 overflow-y-auto">
                    {filteredTasks.map((task) => (
                        <li key={task.id} className={editingId === task.id || deletingId === task.id ? "flex flex-col gap-2" : "flex gap-2 min-w-0"}>
                            {deletingId === task.id ? (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-2 rounded-md">
                                    <p className="text-red-600 text-sm font-medium flex-1">Deletar esta tarefa?</p>
                                    <Button onClick={handleDeleteCancel} aria-label="Cancelar exclusão">
                                        <XIcon size={18} />
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteConfirm(task.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                        aria-label="Confirmar exclusão"
                                    >
                                        <TrashIcon size={18} />
                                    </Button>
                                </div>
                            ) : editingId === task.id ? (
                                <>
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
                                            <XIcon size={18} />
                                        </Button>
                                        <Button onClick={() => handleSave(task.id)} aria-label="Salvar edição">
                                            <CheckIcon size={18} />
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => onTaskClick(task.id)}
                                        className={`bg-slate-400 w-full min-w-0 text-left text-white p-2 flex items-center gap-2 rounded-md ${task.isCompleted && "line-through opacity-70"}`}
                                    >
                                        <span className="shrink-0">
                                            {task.isCompleted
                                                ? <CheckCircle2 size={18} />
                                                : <Circle size={18} />
                                            }
                                        </span>
                                        <span className="truncate">{task.title}</span>
                                    </button>
                                    <Button onClick={() => startEditing(task)} aria-label="Editar tarefa">
                                        <PencilIcon size={18} />
                                    </Button>
                                    <Button onClick={() => onSeeDetailsClick(task)} aria-label="Ver detalhes">
                                        <ChevronRightIcon size={18} />
                                    </Button>
                                    <Button onClick={() => handleDeleteRequest(task.id)} aria-label="Deletar tarefa">
                                        <TrashIcon size={18} />
                                    </Button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Tasks;
