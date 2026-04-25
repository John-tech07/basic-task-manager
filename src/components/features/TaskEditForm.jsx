import { AlertCircle, CalendarIcon, CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

function toInputValue(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function TaskEditForm({ task, onSave, onCancel }) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [dueAt, setDueAt] = useState(toInputValue(task.dueAt));
    const [showDue, setShowDue] = useState(!!task.dueAt);
    const [error, setError] = useState("");

    function handleSave() {
        if (!title.trim()) {
            setError("O título é obrigatório!");
            return;
        }
        const dueIso = dueAt ? new Date(dueAt).toISOString() : null;
        onSave(task.id, title.trim(), description.trim(), dueIso);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") onCancel();
    }

    function handleToggleDue() {
        setShowDue(v => !v);
        setDueAt("");
    }

    return (
        <div className="flex flex-col gap-2">
            <Input
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder="Título"
                autoFocus
            />
            <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Descrição (opcional)"
            />
            {showDue && (
                <Input
                    type="datetime-local"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                />
            )}
            <button
                type="button"
                onClick={handleToggleDue}
                className={`cursor-pointer flex items-center gap-1.5 text-xs font-medium transition-colors w-fit ${
                    showDue ? "text-red-400 hover:text-red-500" : "text-slate-400 hover:text-indigo-500"
                }`}
            >
                <CalendarIcon size={13} />
                {showDue ? "Remover prazo" : "Definir prazo"}
            </button>
            {error && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {error}
                </p>
            )}
            <div className="flex gap-1.5 sm:gap-2 justify-end">
                <Button onClick={onCancel} aria-label="Cancelar edição">
                    <XIcon size={16} />
                </Button>
                <Button
                    onClick={handleSave}
                    className="!bg-indigo-600 hover:!bg-indigo-700 !text-white"
                    aria-label="Salvar edição"
                >
                    <CheckIcon size={16} />
                </Button>
            </div>
        </div>
    );
}

export default TaskEditForm;
