import { ClipboardList } from "lucide-react";
import AddTask from "./components/features/AddTask";
import TaskList from "./components/features/TaskList";
import { useTasks } from "./hooks/useTasks";

function App() {
    const { tasks, addTask, toggleTask, editTask, deleteTask } = useTasks();

    return (
        <div className="min-h-screen bg-slate-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="w-full max-w-4xl mx-auto">
                <header className="flex items-center justify-center gap-2 py-6 sm:py-8 lg:py-10">
                    <ClipboardList className="text-indigo-600" size={28} />
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
                        Gerenciador de Tarefas
                    </h1>
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
