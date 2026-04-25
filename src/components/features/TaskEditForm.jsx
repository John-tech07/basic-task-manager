import { AlertCircle, CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

function TaskEditForm({ task, onSave, onCancel }) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [error, setError] = useState("");

    function handleSave() {
        if (!title.trim()) {
            setError("O título é obrigatório!");
            return;
        }
        onSave(task.id, title.trim(), description.trim());
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") onCancel();
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
