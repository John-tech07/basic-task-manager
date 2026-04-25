import { ClipboardList, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signIn(email, password);
            navigate("/");
        } catch (err) {
            setError("E-mail ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-start justify-center px-4 pt-16 sm:pt-24">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <ClipboardList className="text-indigo-600" size={28} />
                    <span className="text-xl font-bold text-slate-800">Gerenciador de Tarefas</span>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Entrar na conta</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">E-mail</label>
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Senha</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm flex items-center gap-1.5">
                                <AlertCircle size={14} />
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white w-full min-h-[44px] px-4 py-3 rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center transition-colors"
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>

                    <div className="mt-4 flex flex-col gap-3 text-center text-sm">
                        <Link to="/forgot-password" className="text-indigo-600 hover:underline">
                            Esqueci minha senha
                        </Link>
                        <span className="text-slate-400">
                            Não tem conta?{" "}
                            <Link to="/register" className="text-indigo-600 hover:underline font-medium">
                                Cadastre-se
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
