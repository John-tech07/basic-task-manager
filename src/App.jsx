import { ClipboardList } from "lucide-react";
import { useState } from "react";
import AddTask from "./components/features/AddTask";
import TaskList from "./components/features/TaskList";
import { useTasks } from "./hooks/useTasks";

function App() {
    const { tasks, addTask, toggleTask, editTask, deleteTask } = useTasks();

    const [title, setTitle] = useState(() => localStorage.getItem("appTitle") || "");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [draft, setDraft] = useState("");

    function startEditing() {
        setDraft(title);
        setIsEditingTitle(true);
    }

    function saveTitle() {
        const saved = draft.trim();
        setTitle(saved);
        localStorage.setItem("appTitle", saved);
        setIsEditingTitle(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") saveTitle();
        if (e.key === "Escape") setIsEditingTitle(false);
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="w-full max-w-4xl mx-auto">
                <header className="flex items-center justify-center gap-2 py-6 sm:py-8 lg:py-10">
                    <ClipboardList className="text-indigo-600 shrink-0" size={28} />
                    {isEditingTitle ? (
                        <input
                            autoFocus
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            onBlur={saveTitle}
                            onKeyDown={handleKeyDown}
                            placeholder="Título da Lista"
                            className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 bg-transparent border-b-2 border-indigo-400 focus:outline-none placeholder-slate-300 w-full max-w-xs sm:max-w-sm"
                        />
                    ) : (
                        <h1
                            onClick={startEditing}
                            title="Clique para editar"
                            className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors"
                        >
                            {title || <span className="text-slate-300 font-normal">Título da Lista</span>}
                        </h1>
                    )}
                </header>
                <div className="flex flex-col md:grid md:grid-cols-[5fr_7fr] gap-4 md:gap-6 md:items-start">
                    <AddTask onAddTaskSubmit={addTask} />
                    <TaskList
                        tasks={tasks}
                        onTaskClick={toggleTask}
                        onDeleteTaskClick={deleteTask}
                        onEditTask={editTask}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
