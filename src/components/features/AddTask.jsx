import { AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import Input from "../ui/Input";

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
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3">
            <Input
                type="text"
                placeholder="Digite o título da tarefa"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(""); }}
            />
            <Input
                type="text"
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            {error && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {error}
                </p>
            )}
            <button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
                <Plus size={18} />
                Adicionar tarefa
            </button>
        </div>
    );
}

export default AddTask;
