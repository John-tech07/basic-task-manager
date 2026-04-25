import { ClipboardList, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";

function ForgotPasswordPage() {
    const { sendPasswordReset } = useAuth();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await sendPasswordReset(email);
            setDone(true);
        } catch (err) {
            setError("Não foi possível enviar o e-mail. Verifique o endereço.");
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
                            <h2 className="text-lg font-bold text-slate-800">E-mail enviado</h2>
                            <p className="text-sm text-slate-500">
                                Se esse e-mail estiver cadastrado, você receberá um link para redefinir sua senha.
                            </p>
                            <Link to="/login" className="text-indigo-600 hover:underline text-sm font-medium mt-2">
                                Voltar para o login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">Esqueci minha senha</h2>
                            <p className="text-sm text-slate-400 mb-6">
                                Digite seu e-mail e enviaremos um link para redefinir sua senha.
                            </p>

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
                                    {loading ? "Enviando..." : "Enviar link"}
                                </button>
                            </form>

                            <p className="mt-4 text-center text-sm text-slate-400">
                                <Link to="/login" className="text-indigo-600 hover:underline">
                                    Voltar para o login
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
