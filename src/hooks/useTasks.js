import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

function toApp(row) {
    return {
        id: row.id,
        title: row.title,
        description: row.description ?? "",
        isCompleted: row.is_completed,
        createdAt: row.created_at,
    };
}

async function migrateFromLocalStorage(userId) {
    let local;
    try {
        local = JSON.parse(localStorage.getItem("tasks"));
    } catch {
        return;
    }
    if (!Array.isArray(local) || local.length === 0) return;

    const rows = local.map(t => ({
        id: t.id,
        user_id: userId,
        title: t.title,
        description: t.description ?? "",
        is_completed: t.isCompleted ?? false,
        created_at: t.createdAt ?? new Date().toISOString(),
    }));

    const { error } = await supabase.from("tasks").upsert(rows, { onConflict: "id" });
    if (!error) localStorage.removeItem("tasks");
}

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        async function init() {
            setLoading(true);
            await migrateFromLocalStorage(user.id);

            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) setError(error.message);
            else setTasks((data ?? []).map(toApp));

            setLoading(false);
        }

        init();
    }, [user]);

    async function addTask(title, description) {
        const { data, error } = await supabase
            .from("tasks")
            .insert({ user_id: user.id, title, description: description ?? "" })
            .select()
            .single();

        if (!error) setTasks(prev => [...prev, toApp(data)]);
    }

    async function toggleTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const { error } = await supabase
            .from("tasks")
            .update({ is_completed: !task.isCompleted })
            .eq("id", taskId);

        if (!error) setTasks(prev =>
            prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
        );
    }

    async function editTask(taskId, title, description) {
        const { error } = await supabase
            .from("tasks")
            .update({ title, description })
            .eq("id", taskId);

        if (!error) setTasks(prev =>
            prev.map(t => t.id === taskId ? { ...t, title, description } : t)
        );
    }

    async function deleteTask(taskId) {
        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", taskId);

        if (!error) setTasks(prev => prev.filter(t => t.id !== taskId));
    }

    return { tasks, loading, error, addTask, toggleTask, editTask, deleteTask };
}
