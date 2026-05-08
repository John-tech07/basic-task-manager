import { ClipboardList, LogOut, MoonIcon, PencilIcon, Plus, SunIcon, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TaskList from "./components/tasks/TaskList";
import AddTask from "./components/tasks/AddTask";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./components/ui/dialog";
import { useAuth } from "./contexts/AuthContext";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { supabase } from "./lib/supabase";

function App() {
    const { user, signOut } = useAuth();
    const { tasks, loading: tasksLoading, addTask, toggleTask, editTask, deleteTask, reorderTasks } = useTasks();
    const { isDark, toggleTheme } = useTheme();

    const [title, setTitle] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [draft, setDraft] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        supabase
            .from("user_settings")
            .select("app_title")
            .eq("user_id", user.id)
            .single()
            .then(({ data }) => {
                if (data) setTitle(data.app_title ?? "");
            });
    }, [user]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function startEditing() {
        setDraft(title);
        setIsEditingTitle(true);
    }

    async function saveTitle() {
        const saved = draft.trim();
        setTitle(saved);
        setIsEditingTitle(false);
        await supabase
            .from("user_settings")
            .upsert({ user_id: user.id, app_title: saved }, { onConflict: "user_id" });
    }

    function handleTitleKeyDown(e) {
        if (e.key === "Enter") saveTitle();
        if (e.key === "Escape") setIsEditingTitle(false);
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-md flex flex-col overflow-hidden">

                {/* Header */}
                <header className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                        <ClipboardList className="text-indigo-600 shrink-0" size={24} />
                        {isEditingTitle ? (
                            <input
                                autoFocus
                                value={draft}
                                onChange={e => setDraft(e.target.value)}
                                onBlur={saveTitle}
                                onKeyDown={handleTitleKeyDown}
                                placeholder="Título da Lista"
                                className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 bg-transparent border-b-2 border-indigo-400 focus:outline-none placeholder-slate-300 dark:placeholder-slate-600 min-w-0 w-full"
                            />
                        ) : (
                            <div className="flex items-center gap-1.5 group cursor-pointer min-w-0" onClick={startEditing}>
                                <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                    {title || <span className="text-slate-300 dark:text-slate-600 font-normal">Título da Lista</span>}
                                </h1>
                                <PencilIcon size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0" ref={menuRef}>
                        <button
                            onClick={toggleTheme}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
                        >
                            {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(o => !o)}
                                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Menu do usuário"
                            >
                                <UserCircle size={24} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden z-10">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                        <p className="text-xs text-slate-400 dark:text-slate-500">Conectado como</p>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={signOut}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Task list */}
                <div className="flex-1">
                    {tasksLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <span className="text-slate-400 dark:text-slate-500 text-sm">Carregando tarefas...</span>
                        </div>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            onTaskClick={toggleTask}
                            onDeleteTaskClick={deleteTask}
                            onEditTask={editTask}
                            onReorderTasks={reorderTasks}
                        />
                    )}
                </div>

                {/* Footer: add task button */}
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white w-full min-h-[44px] px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                                <Plus size={18} />
                                Adicionar tarefa
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-slate-800 dark:text-slate-100">
                                    Adicionar uma tarefa
                                </DialogTitle>
                            </DialogHeader>
                            <AddTask
                                onAddTaskSubmit={addTask}
                                onSuccess={() => setDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

            </div>
        </div>
    );
}

export default App;
