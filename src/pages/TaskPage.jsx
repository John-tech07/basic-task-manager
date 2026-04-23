import { CheckCircle2, ChevronLeftIcon, Clock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Title from "../components/Title";

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
        <div className="min-h-screen w-screen bg-slate-500 p-4 sm:p-6">
            <div className="w-full max-w-[500px] mx-auto space-y-4">
                <div className="flex justify-center relative mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-slate-100 absolute left-0 top-0 bottom-0"
                        aria-label="Voltar"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <Title>Detalhes da Tarefa</Title>
                </div>

                {task ? (
                    <div className="bg-slate-200 p-4 rounded-md space-y-3">
                        <h2 className="text-xl text-slate-600 font-bold">{task.title}</h2>
                        <p className="text-slate-600">{task.description}</p>
                        <div className={`flex items-center gap-1 text-sm font-medium ${task.isCompleted ? 'text-green-600' : 'text-slate-400'}`}>
                            {task.isCompleted
                                ? <><CheckCircle2 size={15} /> Concluída</>
                                : <><Clock size={15} /> Pendente</>
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
                ) : (
                    <div className="bg-slate-200 p-4 rounded-md text-center text-slate-500">
                        Tarefa não encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskPage;
