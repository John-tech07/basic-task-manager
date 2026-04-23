const FILTERS = [
    { value: "all",       label: "Todas"      },
    { value: "pending",   label: "Pendentes"  },
    { value: "completed", label: "Concluídas" },
];

function TaskFilters({ filter, onFilterChange, completedCount, totalCount }) {
    return (
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100">
            <div className="flex gap-1.5">
                {FILTERS.map(f => (
                    <button
                        key={f.value}
                        onClick={() => onFilterChange(f.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            filter === f.value
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
                {completedCount} de {totalCount} concluída{totalCount !== 1 ? "s" : ""}
            </span>
        </div>
    );
}

export default TaskFilters;
