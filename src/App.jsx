import { ClipboardList } from "lucide-react";
import AddTask from "./components/features/AddTask";
import TaskList from "./components/features/TaskList";
import { useTasks } from "./hooks/useTasks";

function App() {
    const { tasks, addTask, toggleTask, editTask, deleteTask } = useTasks();

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
            <div className="w-full max-w-[500px] mx-auto space-y-4">
                <header className="flex items-center justify-center gap-2 py-4">
                    <ClipboardList className="text-indigo-600" size={32} />
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        Gerenciador de Tarefas
                    </h1>
                </header>
                <AddTask onAddTaskSubmit={addTask} />
                <TaskList
                    tasks={tasks}
                    onTaskClick={toggleTask}
                    onDeleteTaskClick={deleteTask}
                    onEditTask={editTask}
                />
            </div>
        </div>
    );
}

export default App;
