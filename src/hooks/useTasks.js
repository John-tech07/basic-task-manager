import { useEffect, useState } from "react";
import { v4 } from "uuid";

export function useTasks() {
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

    function addTask(title, description) {
        setTasks(prev => [...prev, {
            id: v4(),
            title,
            description,
            isCompleted: false,
            createdAt: new Date().toISOString(),
        }]);
    }

    function toggleTask(taskId) {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        ));
    }

    function editTask(taskId, title, description) {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, title, description } : task
        ));
    }

    function deleteTask(taskId) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    }

    return { tasks, addTask, toggleTask, editTask, deleteTask };
}
