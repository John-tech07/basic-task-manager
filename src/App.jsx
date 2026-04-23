import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";
import { v4 } from "uuid";

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch {
      // localStorage indisponível (ex: modo privado restrito)
    }
  }, [tasks]);

  function onTaskClick(taskId) {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    setTasks(newTasks);
  }

  function onDeleteTaskClick(taskId) {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
  }

  function onEditTask(taskId, title, description) {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, title, description };
      }
      return task;
    });
    setTasks(newTasks);
  }

  function onAddTaskSubmit(title, description) {
    const newTask = {
      id: v4(),
      title,
      description,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-[500px] mx-auto space-y-4">
        <header className="flex items-center justify-center gap-2 py-4">
          <ClipboardList className="text-indigo-600" size={32} />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Gerenciador de Tarefas
          </h1>
        </header>
        <AddTask onAddTaskSubmit={onAddTaskSubmit} />
        <Tasks
          tasks={tasks}
          onTaskClick={onTaskClick}
          onDeleteTaskClick={onDeleteTaskClick}
          onEditTask={onEditTask}
        />
      </div>
    </div>
  );
}

export default App;
