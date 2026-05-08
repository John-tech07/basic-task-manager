import { AlertCircle, CalendarIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Input from "../ui/Input";

function AddTask({ onAddTaskSubmit, onSuccess }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueAt, setDueAt] = useState("");
    const [showDue, setShowDue] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit() {
        if (!title.trim()) {
            setError("O título é obrigatório!");
            return;
        }
        const dueIso = dueAt ? new Date(dueAt).toISOString() : null;
        onAddTaskSubmit(title, description, dueIso);
        setTitle("");
        setDescription("");
        setDueAt("");
        setShowDue(false);
        setError("");
        onSuccess?.();
    }

    function handleToggleDue() {
        setShowDue(v => !v);
        setDueAt("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSubmit();
    }

    return (
        <div className="flex flex-col gap-3">
            <Input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            <Input
                type="text"
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
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
                className={`cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors w-fit ${
                    showDue
                        ? "border-red-200 dark:border-red-900 text-red-400 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900"
                        : "border-indigo-200 dark:border-indigo-800 text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                }`}
            >
                {showDue
                    ? <><XIcon size={13} /> Remover prazo</>
                    : <><CalendarIcon size={13} /> Definir prazo</>
                }
            </button>

            {error && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {error}
                </p>
            )}

            <button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white w-full min-h-[44px] px-4 py-3 rounded-lg text-sm font-semibold transition-colors mt-1"
            >
                Adicionar tarefa
            </button>
        </div>
    );
}

export default AddTask;
