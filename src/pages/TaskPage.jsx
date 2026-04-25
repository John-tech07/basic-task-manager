import { CheckCircle2, ChevronLeftIcon, Clock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

function TaskPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const tasks = (() => {
        try {
            return JSON.parse(localStorage.getItem("tasks")) || [];
        } catch {
            return [];
        }
    })();

    const task = tasks.find(t => t.id === id);

    return (
        <div className="min-h-screen bg-slate-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="w-full max-w-lg mx-auto space-y-4">
                <div className="flex items-center gap-3 py-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-white shadow-sm text-slate-600 hover:text-indigo-600 transition-colors"
                        aria-label="Voltar"
                    >
                        <ChevronLeftIcon size={20} />
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-800">Detalhes da Tarefa</h1>
                </div>

                {task ? (
                    <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">{task.title}</h2>
                            {task.description && (
                                <p className="text-slate-500 mt-1 text-sm">{task.description}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                            <div className={`flex items-center gap-1.5 text-sm font-medium ${task.isCompleted ? "text-indigo-600" : "text-slate-400"}`}>
                                {task.isCompleted
                                    ? <><CheckCircle2 size={16} /> Concluída</>
                                    : <><Clock size={16} /> Pendente</>
                                }
                            </div>
                            {task.createdAt && (
                                <p className="text-xs text-slate-400">
                                    Criada em {new Intl.DateTimeFormat("pt-BR", {
                                        day: "2-digit", month: "2-digit", year: "numeric",
                                        hour: "2-digit", minute: "2-digit",
                                    }).format(new Date(task.createdAt))}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-5 text-center text-slate-400 text-sm">
                        Tarefa não encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskPage;
