import { useEffect, useState } from "react";

function getInitialTheme() {
    try {
        const stored = localStorage.getItem("theme");
        if (stored === "dark" || stored === "light") return stored;
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch {}
    return "light";
}

export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        try {
            localStorage.setItem("theme", theme);
        } catch {}
    }, [theme]);

    function toggleTheme() {
        setTheme(t => (t === "dark" ? "light" : "dark"));
    }

    return { theme, toggleTheme, isDark: theme === "dark" };
}
