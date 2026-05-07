const FILTERS = [
    { value: "all",       label: "Todas"      },
    { value: "pending",   label: "Pendentes"  },
    { value: "completed", label: "Concluídas" },
];

function TaskFilters({ filter, onFilterChange, completedCount, totalCount }) {
    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 border-b border-slate-100 dark:border-slate-700">
            <div className="flex gap-1.5 flex-1">
                {FILTERS.map(f => (
                    <button
                        key={f.value}
                        onClick={() => onFilterChange(f.value)}
                        className={`px-3 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                            filter === f.value
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                {completedCount} de {totalCount} concluída{totalCount !== 1 ? "s" : ""}
            </span>
        </div>
    );
}

export default TaskFilters;
