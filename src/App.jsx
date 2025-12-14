import { useState } from "react";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";

function App() {
  const [tasks, setTasks] = useState([{
    id: 1,
    title: "Estudar React",
    description: "Estudar React para ser um Dev Front-end",
    isCompleted: false
  },
    {
    id: 2,
    title: "Ler a Bíblia",
    description: "Ler a Bíblia diáriamente.",
    isCompleted: false
    },
    {
    id: 3,
    title: "Treinar",
    description: "Ir a academia para ser saudável",
    isCompleted: false
  }
]);

function onTaskClick(taskId) {
  const newTasks = tasks.map(task => {
    if (task.id === taskId) {
      return {...task, isCompleted: !task.isCompleted}
    }
  

    return task;
  });
  setTasks(newTasks);
}
  

  function onDeleteTaskClick(taskId) {
    const newTasks = tasks.filter(task => task.id != taskId);
      setTasks(newTasks);
    } 
  
  function onAddTaskSubmit(title, description) {
    const newTasks = {
      id: tasks.lenght + 1,
      title,
      description,
      isCompleted: false,
    };
    setTasks([...tasks, newTasks])
  }

  return (
    <div className="w-screen h-screen bg-slate-500 flex justify-center p-6">
      <div className="w-[500px] space-y-4">
        <h1 className="text-3xl text-slate-100 font-bold text-center">Gerenciador de Tarefas</h1>
        <AddTask tasks={tasks} onAddTaskSubmit={onAddTaskSubmit}/>
        <Tasks 
        tasks={tasks} onTaskClick={onTaskClick} onDeleteTaskClick={onDeleteTaskClick} />
      </div>
    </div>

  );
}

export default App;