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
        dueAt: row.due_at ?? null,
        position: row.position ?? null,
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

            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            await supabase.from("tasks")
                .delete()
                .eq("is_completed", true)
                .lt("created_at", sevenDaysAgo);

            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .order("position", { ascending: true, nullsFirst: false })
                .order("created_at", { ascending: true });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            const mapped = (data ?? []).map(toApp);

            const hasNullPositions = mapped.some(t => t.position === null);
            if (hasNullPositions) {
                const updates = mapped.map((t, i) => ({ id: t.id, position: i + 1 }));
                await supabase.from("tasks").upsert(updates, { onConflict: "id" });
                mapped.forEach((t, i) => { t.position = i + 1; });
            }

            setTasks(mapped);
            setLoading(false);
        }

        init();
    }, [user]);

    async function addTask(title, description, dueAt) {
        const nextPosition = tasks.length > 0
            ? Math.max(...tasks.map(t => t.position ?? 0)) + 1
            : 1;

        const { data, error } = await supabase
            .from("tasks")
            .insert({ user_id: user.id, title, description: description ?? "", due_at: dueAt || null, position: nextPosition })
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

    async function editTask(taskId, title, description, dueAt) {
        const { error } = await supabase
            .from("tasks")
            .update({ title, description, due_at: dueAt || null })
            .eq("id", taskId);

        if (!error) setTasks(prev =>
            prev.map(t => t.id === taskId ? { ...t, title, description, dueAt: dueAt || null } : t)
        );
    }

    async function deleteTask(taskId) {
        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", taskId);

        if (!error) setTasks(prev => prev.filter(t => t.id !== taskId));
    }

    async function reorderTasks(newOrderedTasks) {
        setTasks(newOrderedTasks);
        const updates = newOrderedTasks.map((t, i) => ({ id: t.id, position: i + 1 }));
        await supabase.from("tasks").upsert(updates, { onConflict: "id" });
    }

    return { tasks, loading, error, addTask, toggleTask, editTask, deleteTask, reorderTasks };
}
