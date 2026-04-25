import { ClipboardList, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";

function RegisterPage() {
    const { signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("As senhas não coincidem.");
            return;
        }
        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password);
            setDone(true);
        } catch (err) {
            setError(err.message || "Erro ao criar conta. Tente novamente.");
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
                    {done ? (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                            <CheckCircle2 className="text-indigo-500" size={40} />
                            <h2 className="text-lg font-bold text-slate-800">Verifique seu e-mail</h2>
                            <p className="text-sm text-slate-500">
                                Enviamos um link de confirmação para <strong>{email}</strong>.
                                Clique no link para ativar sua conta.
                            </p>
                            <Link to="/login" className="text-indigo-600 hover:underline text-sm font-medium mt-2">
                                Voltar para o login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-bold text-slate-800 mb-6">Criar conta</h2>

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
                                        placeholder="Mínimo 6 caracteres"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Confirmar senha</label>
                                    <Input
                                        type="password"
                                        placeholder="Repita a senha"
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
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
                                    {loading ? "Criando conta..." : "Criar conta"}
                                </button>
                            </form>

                            <p className="mt-4 text-center text-sm text-slate-400">
                                Já tem conta?{" "}
                                <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                                    Entrar
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
