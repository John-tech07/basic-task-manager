import { AlertCircle, Plus } from "lucide-react";
import Input from "./Input";
import { useState } from "react";

function AddTask({ onAddTaskSubmit }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    function handleSubmit() {
        if (!title.trim()) {
            setError("O título é obrigatório!");
            return;
        }
        onAddTaskSubmit(title, description);
        setTitle("");
        setDescription("");
        setError("");
    }

    return (
        <div className="space-y-4 p-6 bg-slate-200 rounded-md shadow flex flex-col">
            <Input
                type="text"
                placeholder="Digite o título da tarefa"
                value={title}
                onChange={(event) => { setTitle(event.target.value); setError(""); }}
            />
            <Input
                type="text"
                placeholder="Digite a descrição da tarefa"
                value={description}
                onChange={(event) => { setDescription(event.target.value); setError(""); }}
            />
            {error && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {error}
                </p>
            )}
            <button
                onClick={handleSubmit}
                className="bg-slate-500 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2"
            >
                <Plus size={18} />
                Adicionar
            </button>
        </div>
    );
}

export default AddTask;
